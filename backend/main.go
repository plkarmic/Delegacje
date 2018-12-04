package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/tidwall/gjson"
)

var (
	router    *mux.Router
	startTime time.Time
	endTime   time.Time
	tripData  Trip
)

type Input struct {
	StartDate string `json:"StartDate"`
	EndDate   string `json:"EndDate"`
}

type Output struct {
	DurationHours float64 `json:"DudationHours"`
}

type RowTrip struct {
	CountryFrom   string //start point
	CountryTo     string //destination point
	StartTime     time.Time
	ArrivalTime   time.Time
	BorderTime    time.Time
	TransportType string
}
type Expanses struct {
	Remark  string
	CostV   float64
	CostPLN float64
}

type Trip struct {
	startTime                 time.Time
	endTime                   time.Time
	transportType             string    //car, plain, train, etc
	destination               string    //destination country
	details                   []RowTrip //array of strings with information for each trip details (time of departure, time of arrival,  boarder cross date, etc.)
	expansesDetails           []Expanses
	ryczaltWyzywienie         int64
	ryczaltWyzywienieDetale   string
	sniadanieCount            float64
	obiadyCount               float64
	kolacjeCount              float64
	ryczaltDoajzdyBagaze      int64
	ryczaltDojazdyKomunikacja int64
	ryczaltNoclegi            int64
	durtion                   float64
	totalCost                 float64
}

func home(w http.ResponseWriter, r *http.Request) {
	var inData Input
	inData.StartDate = "2018-01-01"
	inData.EndDate = "2018-10-01"
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tripData)

	defer r.Body.Close()
}

func readBody(w http.ResponseWriter, r *http.Request) {
	var bodyBytes []byte
	if r.Body != nil {
		bodyBytes, _ = ioutil.ReadAll(r.Body)
	}
	// Restore the io.ReadCloser to its original state
	r.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
	// Use the content
	bodyString := string(bodyBytes)

	tripData = getTripDetails(bodyString)

	fmt.Fprint(w, (strconv.FormatFloat(tripData.totalCost, 'f', 4, 64))+";"+(strconv.FormatFloat(tripData.durtion, 'f', -1, 64)))

	defer r.Body.Close()

}

func getTripDetails(rawData string) Trip {
	var trip Trip
	var rowDetail RowTrip
	var expanseDetail Expanses
	var roundTripNbr string     //used to get number of rows in roundTrip
	var tempQueryEndTime string //used to get query string for last row in roundTrip
	var dataLayout string

	roundTripNbr = gjson.Get(rawData, "roundTrip.#").String()
	strTmp, _ := strconv.Atoi(roundTripNbr) //convert string to Int, then remove 1 as the first row is 0
	tempQueryEndTime = "roundTrip." + strconv.Itoa(strTmp-1) + ".endTime"

	//dataLayout = "01/02/2006 15:04"
	dataLayout = "2006-01-02T15:04"

	trip.transportType = gjson.Get(rawData, "transportType").String()
	trip.startTime, _ = time.Parse(dataLayout, gjson.Get(rawData, "roundTrip.0.startTime").String())
	trip.endTime, _ = time.Parse(dataLayout, gjson.Get(rawData, tempQueryEndTime).String())

	trip.ryczaltWyzywienie = gjson.Get(rawData, "ryczaltWyzywienie").Int()
	trip.ryczaltWyzywienieDetale = gjson.Get(rawData, "ryczaltWyzywienieDetale").String()
	trip.sniadanieCount = gjson.Get(rawData, "sniadanieCount").Float()
	trip.obiadyCount = gjson.Get(rawData, "obiadyCount").Float()
	trip.kolacjeCount = gjson.Get(rawData, "kolacjeCount").Float()
	trip.ryczaltDoajzdyBagaze = gjson.Get(rawData, "ryczaltDoajzdyBagaze").Int()
	trip.ryczaltDojazdyKomunikacja = gjson.Get(rawData, "ryczaltDojazdyKomunikacja").Int()
	trip.ryczaltNoclegi = gjson.Get(rawData, "ryczaltNoclegi").Int()

	tripDetail := gjson.Get(rawData, "roundTrip")
	tripDetail.ForEach(func(key, value gjson.Result) bool { //populate trip details in trip struct
		println(value.String())
		//trip.details = make(RowTrip, 0)

		rowDetail.StartTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "startTime").String())
		rowDetail.ArrivalTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "endTime").String())
		rowDetail.BorderTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "borderTime").String())
		rowDetail.CountryTo = strings.Title(strings.ToLower(gjson.Get(value.String(), "destinationC").String()))      //upper case to lower case and first letter as captial
		rowDetail.CountryFrom = strings.Title(strings.ToLower(gjson.Get(value.String(), "country").String()))         //upper case to lower case and first letter as captial
		rowDetail.TransportType = strings.Title(strings.ToLower(gjson.Get(value.String(), "transportType").String())) //upper case to lower case and first letter as captial
		trip.details = append(trip.details, rowDetail)
		return true
	})

	expansesDetail := gjson.Get(rawData, "expansesDetails")
	expansesDetail.ForEach(func(key, value gjson.Result) bool {
		expanseDetail.Remark = gjson.Get(value.String(), "remark").String()
		expanseDetail.CostV = gjson.Get(value.String(), "costV").Float()
		expanseDetail.CostPLN = gjson.Get(value.String(), "costPLN").Float()

		trip.expansesDetails = append(trip.expansesDetails, expanseDetail)
		return true
	})

	trip.totalCost, trip.durtion = calculate(trip)
	trip.totalCost = calculateTotalCost(trip)
	fmt.Println(trip)
	return trip

}

func getExchangeReate(currency string) float64 {
	url := "http://api.nbp.pl/api/exchangerates/rates/A/" + currency

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("cache-control", "no-cache")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	return gjson.Get(string(body), "rates.0.mid").Float()

	//body.rates[0].mid

}

func cena(time float64, country string) float64 {
	//var Countryquerry string
	//var Countrypricequerry string
	//var Countrycurrencyquerry string
	var result float64
	//var days int
	var modulo int

	jsonFile, _ := os.Open("./CountryTable1.json")
	defer jsonFile.Close()
	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		//	panic(err)
	}
	// var Kraj Countries
	// json.Unmarshal(byteValue, &Kraj)
	bodySTR := string(byteValue)
	//fmt.Println(bodySTR)
	// roundTripNbr = gjson.Get(rawData, "roundTrip.#").String()
	// strTmp, _ := strconv.Atoi(roundTripNbr) //convert string to Int, then remove 1 as the first row is 0

	//Countryquerry := country+
	Countrypricequerry := country + ".0.kwota"
	Countrycurrencyquerry := country + ".0.waluta"
	countryPrice := gjson.Get(bodySTR, Countrypricequerry).Float()
	countryCurrency := gjson.Get(bodySTR, Countrycurrencyquerry).String()
	exchangeRate := getExchangeReate(countryCurrency)
	fmt.Println(exchangeRate)
	//test := 2 * countryCurrency
	// a =10 , b=20 a%b = 0
	fmt.Println(countryPrice)
	modulo = int(time) % 24

	if country == "Polska" {
		if time < 8 {
			result = 0
		} else {
			if time >= 8 && time < 12 {

				result = countryPrice / 2
			} else {
				if time >= 12 && time <= 24 {
					result = countryPrice
				} else {
					if time > 24 {
						days := int(time / 24)
						//Result1 := int(countryPrice) * days
						result = countryPrice * float64(days)
						if modulo < 8 {
							result = result + 0
						} else {
							if modulo >= 8 && modulo < 12 {
								result = result + (countryPrice / 2)
							} else {
								if modulo >= 12 && modulo < 24 {
									result = result + countryPrice
								}
							}
						}
					}
				}
			}
		}

	} else {
		if time < 8 {
			result = (countryPrice / 3) * exchangeRate

		} else {
			if time >= 8 && time < 12 {

				result = (countryPrice / 2) * exchangeRate
			} else {
				if time >= 12 && time <= 24 {
					result = countryPrice * exchangeRate
				} else {
					if time > 24 {
						days := int(time / 24)

						result = countryPrice * float64(days) * exchangeRate
						if modulo < 8 {
							result = result + ((countryPrice / 3) * exchangeRate)
						} else {
							if modulo >= 8 && modulo < 12 {
								result = result + ((countryPrice / 2) * exchangeRate)
							} else {
								if modulo >= 12 && modulo < 24 {
									result = result + (countryPrice * exchangeRate)
								}
							}
						}
					}
				}
			}
		}
	}

	return result

}

func calculate(trip Trip) (float64, float64) { //MAGIC :)

	var czas time.Duration
	//var prevBorderDate time.Time //use to track borderDate from previous row
	var TripDuration time.Duration
	var j int
	var airplane int = 0
	var zeroDay, _ = time.Parse("01/02/2006 15:04", "01/01/0001 00:00")
	var price float64
	var dieta float64
	var TripDays int64
	var calculatedieta float64
	var CountryFrom string

	for i := range trip.details {
		/// SAMOLOT ??
		if trip.details[i].TransportType == "Samolot" {
			if airplane == 0 {
				trip.details[i].BorderTime = trip.details[i].StartTime
				CountryFrom = trip.details[i].CountryFrom
				airplane = 1
				if i != 0 {
					trip.details[i].BorderTime = trip.details[i].ArrivalTime
					czas = trip.details[i].ArrivalTime.Sub(trip.details[i-1].BorderTime)
					TripDuration += czas
					dieta += cena(czas.Hours(), trip.details[i].CountryFrom)

				}
			} else if airplane == 1 {
				if trip.details[i].CountryTo != CountryFrom {
					trip.details[i].BorderTime = trip.details[i].StartTime
					czas = trip.details[i].StartTime.Sub(trip.details[i-1].StartTime)
					TripDuration += czas
					dieta += cena(czas.Hours(), trip.details[i].CountryFrom)
				} else {
					trip.details[i].BorderTime = trip.details[i].ArrivalTime
					czas = trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
					TripDuration += czas
					dieta += cena(czas.Hours(), trip.details[i].CountryFrom)
					airplane = 0
				}
			}
		} else {
			airplane = 0
			if i == 0 {
				if trip.details[i].CountryFrom == "Polska" { //zbedne poniższy else też obliczy diete dla Polska
					if trip.details[i].BorderTime == zeroDay {
						trip.details[i].BorderTime = trip.details[i].ArrivalTime
					}
					czas = trip.details[i].BorderTime.Sub(trip.details[i].StartTime)
					TripDuration += czas
					price = cena(czas.Hours(), "Polska")
					dieta = price

				} else {
					if trip.details[i].BorderTime == zeroDay {
						trip.details[i].BorderTime = trip.details[i].ArrivalTime
						// czas = trip.details[i].StartTime.Sub(trip.details[i].BorderTime)
						// price = cena(czas.Hours(), trip.details[i].CountryFrom)
						// dieta += price
					}
					czas = trip.details[i].StartTime.Sub(trip.details[i].BorderTime)
					TripDuration += czas
					price = cena(czas.Hours(), trip.details[i].CountryFrom)
					dieta += price

				}
			} else {
				if trip.details[i].BorderTime == zeroDay {
					trip.details[i].BorderTime = trip.details[i].ArrivalTime
					//sprawdzenie czy kraj ostatniego przyjazdu jest taki sam jak kraj przyjazdu dla tego wiersza
					if trip.details[i].CountryTo == trip.details[i-1].CountryFrom && trip.transportType == "Samolot" {
						czas = trip.details[i].BorderTime.Sub(trip.details[i-1].StartTime)
						TripDuration += czas
						price = cena(czas.Hours(), trip.details[i].CountryFrom)
						dieta = price
					} else {
						czas = trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
						TripDuration += czas
						price = cena(czas.Hours(), trip.details[i].CountryFrom)
						//czas1 := czas.Hours()
						dieta += price
					}
				} else {
					czas = trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
					TripDuration += czas
					price = cena(czas.Hours(), trip.details[i].CountryFrom)
					dieta += price
				}
			}
		}
		j = i
	}

	if trip.details[j].BorderTime != zeroDay && trip.details[j].TransportType != "Samolot" {
		czas = trip.details[j].ArrivalTime.Sub(trip.details[j].BorderTime)
		TripDuration += czas
		price = cena(czas.Hours(), trip.details[j].CountryTo)
		dieta += price
	}

	fmt.Println(trip.details[j].CountryFrom)
	TripDays = (int64(TripDuration.Hours()) / 24)
	//dieta jest liczona w zaleznosci od kraju (dla polski inna stawka procentowa niz dla zagranicy)
	if trip.details[j].CountryFrom != "Polska" {
		calculatedieta = dieta - ((dieta * float64(0.15) * (trip.sniadanieCount / float64(TripDays))) + (dieta * float64(0.30) * (trip.obiadyCount / float64(TripDays))) + (dieta * float64(0.30) * (trip.kolacjeCount / float64(TripDays))))
	} else {
		calculatedieta = dieta - ((dieta * float64(0.25) * (trip.sniadanieCount / float64(TripDays))) + (dieta * float64(0.50) * (trip.obiadyCount / float64(TripDays))) + (dieta * float64(0.25) * (trip.kolacjeCount / float64(TripDays))))
	}

	//calculatedieta = dieta - ((dieta * float64(0.15) * (trip.sniadanieCount / float64(TripDays))) + (dieta * float64(0.15) * (trip.sniadanieCount / float64(TripDays))))

	return calculatedieta, TripDuration.Hours()

}

// func calculate(trip Trip) time.Duration { //MAGIC :)

// 	var dieta time.Duration
// 	var prevBorderDate time.Time //use to track borderDate from previous row
// 	var j int
// 	var zeroDay, _ = time.Parse("2006-01-02T15:04", "0001/01/01T00:00")

// 	prevBorderDate = zeroDay

// 	for i := range trip.details {
// 		if trip.details[i].BorderTime != zeroDay { //sprawdzic wartosc zmiennej w przypadku przekazania pustego ciągu z formularza -> funkcja getTripDetails: ustawic zeroDay
// 			if prevBorderDate == zeroDay && i == 0 {
// 				dieta = trip.details[i].BorderTime.Sub(trip.details[i].StartTime)
// 				// prevBorderDate = trip.details[i].BorderTime
// 			} else {
// 				dieta += trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)

// 			}
// 		}
// 		j = i
// 	}
// 	dieta += trip.details[j].ArrivalTime.Sub(trip.details[j].BorderTime)

// 	return dieta
// }

func calculateTotalCost(trip Trip) float64 { //calculte total cost -> dieta + otherExpanses
	for i := range trip.expansesDetails {
		trip.totalCost += trip.expansesDetails[i].CostPLN
	}
	return trip.totalCost
}

func main() {
	router = mux.NewRouter()
	router.HandleFunc("/", home).Methods("GET")
	//router.HandleFunc("/", insert).Methods("POST")

	router.HandleFunc("/", readBody).Methods("POST")
	router.HandleFunc("/", readBody).Methods("OPTIONS")

	// corsObj := handlers.AllowedOrigins([]string{"*"})
	// headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	// originsOk := handlers.AllowedOrigins([]string{os.Getenv("ORIGIN_ALLOWED")})
	// methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Fatal(http.ListenAndServe(":8080", handler))

}
