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
	Breakfast     float64
	Lunch         float64
	Dinner        float64
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
	exchangeRate              float64
	totalCostexchRate         float64
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

	fmt.Fprint(w, (strconv.FormatFloat(tripData.totalCost, 'f', 2, 64))+";"+(strconv.FormatFloat(tripData.durtion, 'f', -1, 64))+";"+(strconv.FormatFloat(tripData.totalCostexchRate, 'f', 2, 64)))

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
		rowDetail.Breakfast = gjson.Get(value.String(), "breakfast").Float()
		rowDetail.Lunch = gjson.Get(value.String(), "lunch").Float()
		rowDetail.Dinner = gjson.Get(value.String(), "dinner").Float()
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

	trip.exchangeRate = gjson.Get(rawData, "exchangeRate").Float()

	trip.totalCost, trip.durtion, trip.totalCostexchRate = calculate(trip)
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

func cena(time float64, country string, exchangeRate float64) (float64, float64, float64) {

	var result float64
	var resultCurrency float64

	var modulo int

	jsonFile, _ := os.Open("./CountryTable1.json")
	defer jsonFile.Close()
	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {

	}
	bodySTR := string(byteValue)
	Countrypricequerry := country + ".0.kwota"

	countryPrice := gjson.Get(bodySTR, Countrypricequerry).Float()
	fmt.Println(exchangeRate)
	fmt.Println(countryPrice)
	modulo = int(time) % 24

	if country == "Polska" {
		if time <= 8 {
			result = 0
		} else {
			if time > 8 && time <= 12 {
				result = countryPrice / 2
			} else {
				if time > 12 && time <= 24 {
					result = countryPrice
				} else {
					if time > 24 {
						days := int(time / 24)
						//Result1 := int(countryPrice) * days
						result = countryPrice * float64(days)
						if modulo <= 8 {
							result = result + (countryPrice / 2)
						} else {
							if modulo > 8 {
								result = result + countryPrice
							}
						}
					}
				}
			}
		}
	} else {
		if time <= 8 {
			result = (countryPrice / 3) * exchangeRate
			resultCurrency = (countryPrice / 3)
		} else {
			if time > 8 && time <= 12 {

				result = (countryPrice / 2) * exchangeRate
				resultCurrency = (countryPrice / 2)
			} else {
				if time > 12 && time <= 24 {
					result = countryPrice * exchangeRate
					resultCurrency = countryPrice
				} else {
					if time > 24 {
						days := int(time / 24)

						result = countryPrice * float64(days) * exchangeRate
						resultCurrency = countryPrice * float64(days)
						if modulo <= 8 {
							result = result + ((countryPrice / 3) * exchangeRate)
							resultCurrency = resultCurrency + (countryPrice / 3)
						} else {
							if modulo > 8 && modulo <= 12 {
								result = result + ((countryPrice / 2) * exchangeRate)
								resultCurrency = resultCurrency + (countryPrice / 2)
							} else {
								if modulo > 12 && modulo < 24 {
									result = result + (countryPrice * exchangeRate)
									resultCurrency = resultCurrency + countryPrice
								}
							}
						}
					}
				}
			}
		}
	}

	return result, resultCurrency, countryPrice

}

func calculate(trip Trip) (float64, float64, float64) { //MAGIC :)

	var czas time.Duration
	//var prevBorderDate time.Time //use to track borderDate from previous row
	var TripDuration time.Duration
	var j int
	var k int = 0
	//var i int = 0
	// var boardercrossed int = 0
	// var firstairplanerow int = 0
	// var airplane int = 0
	var zeroDay, _ = time.Parse("01/02/2006 15:04", "01/01/0001 00:00")
	var price float64
	var priceCurrency float64
	var dieta float64
	var dietaCurrency float64
	var TripDays int64
	var calculatedieta float64
	var RowsSum int = 0
	var CountryPrice float64
	for i := range trip.details {
		RowsSum = i
	}

	//	for i := range trip.details{
	//i := 0
	for i := 0; i <= RowsSum; i++ {
		if trip.details[i].CountryFrom == trip.details[i].CountryTo {
			for k = i + 1; k <= RowsSum; k++ {
				if trip.details[i].CountryFrom != trip.details[k].CountryTo {
					j = k
					break
				}
				j = k + 1
				if j > RowsSum {
					j = j - 1
				}
			}
			if k > RowsSum {
				j = RowsSum
			}
			if trip.details[j].BorderTime == zeroDay {
				trip.details[j].BorderTime = trip.details[j].ArrivalTime
				czas = trip.details[j].BorderTime.Sub(trip.details[i].StartTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[i].CountryFrom, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if trip.details[i].Breakfast != 0 || trip.details[i].Lunch != 0 || trip.details[i].Dinner != 0 {
					if trip.details[i].CountryFrom != "Polska" {
						calculatedieta += dieta - ((dietatemp * float64(0.15) * (trip.details[i].Breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i].Lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i].Dinner / float64(TripDays))))
					} else {
						calculatedieta += dieta - ((dietatemp * float64(0.25) * (trip.details[i].Breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (trip.details[i].Lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (trip.details[i].Dinner / float64(TripDays))))
					}
				} else {
					calculatedieta += dieta
				}
			} else {
				czas = trip.details[j].BorderTime.Sub(trip.details[i].StartTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[i].CountryFrom, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if trip.details[i+1].Breakfast != 0 || trip.details[i+1].Lunch != 0 || trip.details[i+1].Dinner != 0 {
					if trip.details[i].CountryFrom != "Polska" {
						calculatedieta += dieta - ((dietatemp * float64(0.15) * (trip.details[i].Breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i].Lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i].Dinner / float64(TripDays))))
					} else {
						calculatedieta += dieta - ((dietatemp * float64(0.25) * (trip.details[i].Breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (trip.details[i].Lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (trip.details[i].Dinner / float64(TripDays))))
					}
				} else {
					calculatedieta += dieta
				}

			}
			i = j
		} else {
			if trip.details[i].BorderTime == zeroDay {
				trip.details[i].BorderTime = trip.details[i].StartTime
			}
			for k = i + 1; k <= RowsSum; k++ {
				if trip.details[i].CountryTo != trip.details[k].CountryTo {
					j = k
					break
				}
				j = k + 1
				if j > RowsSum {
					j = j - 1
				}
			}
			if k > RowsSum {
				j = RowsSum
			}
			if trip.details[j].BorderTime == zeroDay {
				trip.details[j].BorderTime = trip.details[j].ArrivalTime
				czas = trip.details[j].BorderTime.Sub(trip.details[i].BorderTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[i].CountryTo, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if trip.details[i+1].Breakfast != 0 || trip.details[i+1].Lunch != 0 || trip.details[i+1].Dinner != 0 {
					if trip.details[i].CountryTo != "Polska" {
						calculatedieta += dieta - ((dietatemp * float64(0.15) * (trip.details[i+1].Breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i+1].Lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i+1].Dinner / float64(TripDays))))
					} else {
						calculatedieta += dieta - ((dietatemp * float64(0.25) * (trip.details[i+1].Breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (trip.details[i+1].Lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (trip.details[i+1].Dinner / float64(TripDays))))
					}
				} else {
					calculatedieta += dieta
				}
			} else {
				czas = trip.details[j].BorderTime.Sub(trip.details[i].BorderTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[i].CountryFrom, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if trip.details[i+1].Breakfast != 0 || trip.details[i+1].Lunch != 0 || trip.details[i+1].Dinner != 0 {
					if trip.details[i].CountryFrom != "Polska" {
						calculatedieta += dieta - ((dietatemp * float64(0.15) * (trip.details[i+1].Breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i+1].Lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (trip.details[i+1].Dinner / float64(TripDays))))
					} else {
						calculatedieta += dieta - ((dietatemp * float64(0.25) * (trip.details[i+1].Breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (trip.details[i+1].Lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (trip.details[i+1].Dinner / float64(TripDays))))
					}
				} else {
					calculatedieta += dieta
				}

			}

		}
		i = j

	}

	return calculatedieta, TripDuration.Hours(), dietaCurrency

}

func calculateTotalCost(trip Trip) float64 { //calculte total cost -> dieta + otherExpanses
	for i := range trip.expansesDetails {
		trip.totalCost += trip.expansesDetails[i].CostPLN
	}
	return trip.totalCost
}

func showVer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("version: 1.4.1@2019-01-25")

	defer r.Body.Close()
}

func main() {
	router = mux.NewRouter()
	router.HandleFunc("/", home).Methods("GET")
	//router.HandleFunc("/", insert).Methods("POST")

	router.HandleFunc("/", readBody).Methods("POST")
	router.HandleFunc("/", readBody).Methods("OPTIONS")
	router.HandleFunc("/version", showVer).Methods("GET")

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
