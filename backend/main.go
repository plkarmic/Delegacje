package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
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
	// url := "http://localhost:3000/"
	response, err := http.Get(url)

	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
		return 1
	}
	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	}
	fmt.Printf("%s\n", string(contents))
	rate := gjson.Get(string(contents), "rates.0.mid").Float()
	return rate

}

func getCuntryCurrency(w http.ResponseWriter, r *http.Request) {

	country, ok := r.URL.Query()["country"]
	countrystr := "Polska"
	if !ok || len(country[0]) < 1 {
		countrystr = "Polska"
	} else {
		countrystr = country[0]
	}

	jsonFile, _ := os.Open("./CountryTable1.json")
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {

	}
	bodySTR := string(byteValue)

	countrystr = strings.Title(strings.ToLower(countrystr))

	response := gjson.Get(bodySTR, (countrystr + ".0.waluta")).String()

	json.NewEncoder(w).Encode(response)

	defer r.Body.Close()

}

func cena(time float64, country string, exchangeRate float64) (float64, float64, float64) {

	var result float64
	var resultCurrency float64

	var modulo float64

	jsonFile, _ := os.Open("./CountryTable1.json")
	defer jsonFile.Close()
	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {

	}
	bodySTR := string(byteValue)
	Countrypricequerry := country + ".0.kwota"
	Countrypricequerry2 := country + ".0.waluta"

	countryPrice := gjson.Get(bodySTR, Countrypricequerry).Float()
	CountryShortCurrency := gjson.Get(bodySTR, Countrypricequerry2).String()
	fmt.Println(exchangeRate)
	exchangeRate = getExchangeReate(CountryShortCurrency)
	fmt.Println(countryPrice)
	modulo = math.Mod(time, 24)

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

func getFoodDetails(trip Trip, country string) (float64, float64, float64) {
	var breakfast, lunch, dinner float64
	for i := 0; i < len(trip.details); i++ {
		if trip.details[i].CountryFrom == country {
			breakfast += (trip.details[i].Breakfast)
			lunch += (trip.details[i].Lunch)
			dinner += (trip.details[i].Dinner)
		}
	}

	return breakfast, lunch, dinner
}
func stringinarray(str string, list []string) bool {
	for _, v := range list {
		if v == str {
			return true
		}
	}
	return false
}

func calculate(trip Trip) (float64, float64, float64) { //MAGIC :)

	var czas time.Duration
	var TripDuration time.Duration
	var j int
	var k int = 0
	var Border int = 0
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
	countryarray := make([]string, RowsSum)

	//	for i := range trip.details{
	//i := 0
	for i := 0; i <= RowsSum; i++ {
		i = j
		if trip.details[i].CountryFrom == trip.details[i].CountryTo {
			for k = i + 1; k <= RowsSum; k++ {
				if trip.details[i].CountryFrom != trip.details[k].CountryTo {
					j = k
					Border = 1
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
				if Border == 1 {
					if j == RowsSum {
						trip.details[i].StartTime = trip.details[i].ArrivalTime
						trip.details[j].BorderTime = trip.details[j].ArrivalTime
					}
					trip.details[j].BorderTime = trip.details[j].StartTime
					Border = 0
				} else {
					trip.details[j].BorderTime = trip.details[j].ArrivalTime
				}
				czas = trip.details[j].BorderTime.Sub(trip.details[i].StartTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[i].CountryFrom, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				if TripDays == 0 {
					TripDays = 1
				}
				//dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if !stringinarray(trip.details[i].CountryFrom, countryarray) {
					breakfast, lunch, dinner := getFoodDetails(trip, trip.details[i].CountryFrom)
					if breakfast != 0 || lunch != 0 || dinner != 0 {
						if trip.details[i].CountryFrom != "Polska" {
							dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
							countryarray = append(countryarray, trip.details[i].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.15) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (dinner / float64(TripDays))))
						} else {
							dietatemp := (CountryPrice * float64(TripDays))
							countryarray = append(countryarray, trip.details[i].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.25) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (dinner / float64(TripDays))))
						}
					} else {
						calculatedieta += dieta
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
				if TripDays == 0 {
					TripDays = 1
				}
				//dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
				if !stringinarray(trip.details[i].CountryFrom, countryarray) {
					breakfast, lunch, dinner := getFoodDetails(trip, trip.details[i].CountryFrom)
					if breakfast != 0 || lunch != 0 || dinner != 0 {
						if trip.details[i].CountryFrom != "Polska" {
							dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
							countryarray = append(countryarray, trip.details[i].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.15) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (dinner / float64(TripDays))))
						} else {
							dietatemp := (CountryPrice * float64(TripDays))
							countryarray = append(countryarray, trip.details[i].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.25) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (dinner / float64(TripDays))))
						}
					} else {
						calculatedieta += dieta
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
				if TripDays == 0 {
					TripDays = 1
				}
				if !stringinarray(trip.details[i].CountryTo, countryarray) {
					breakfast, lunch, dinner := getFoodDetails(trip, trip.details[i].CountryTo)
					if breakfast != 0 || lunch != 0 || dinner != 0 {
						if trip.details[i].CountryTo != "Polska" {
							dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
							countryarray = append(countryarray, trip.details[i].CountryTo)
							calculatedieta += dieta - ((dietatemp * float64(0.15) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (dinner / float64(TripDays))))
						} else {
							dietatemp := (CountryPrice * float64(TripDays))
							countryarray = append(countryarray, trip.details[i].CountryTo)
							calculatedieta += dieta - ((dietatemp * float64(0.25) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (dinner / float64(TripDays))))
						}
					} else {
						calculatedieta += dieta
					}
				} else {
					calculatedieta += dieta
				}
			} else {
				czas = trip.details[j].BorderTime.Sub(trip.details[i].BorderTime)
				TripDuration += czas
				price, priceCurrency, CountryPrice = cena(czas.Hours(), trip.details[j].CountryFrom, trip.exchangeRate)
				dieta = price
				dietaCurrency = priceCurrency
				TripDays = (int64(czas.Hours()) / 24)
				if TripDays == 0 {
					TripDays = 1
				}
				if !stringinarray(trip.details[i].CountryFrom, countryarray) {
					breakfast, lunch, dinner := getFoodDetails(trip, trip.details[j].CountryFrom)
					if breakfast != 0 || lunch != 0 || dinner != 0 {
						if trip.details[i].CountryFrom != "Polska" {
							dietatemp := (CountryPrice * float64(TripDays) * trip.exchangeRate)
							countryarray = append(countryarray, trip.details[j].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.15) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.30) * (lunch / float64(TripDays))) + (dietatemp * float64(0.30) * (dinner / float64(TripDays))))
						} else {
							dietatemp := (CountryPrice * float64(TripDays))
							countryarray = append(countryarray, trip.details[i].CountryFrom)
							calculatedieta += dieta - ((dietatemp * float64(0.25) * (breakfast / float64(TripDays))) + (dietatemp * float64(0.50) * (lunch / float64(TripDays))) + (dietatemp * float64(0.25) * (dinner / float64(TripDays))))
						}
					} else {
						calculatedieta += dieta
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
	json.NewEncoder(w).Encode("version: 1.6@2019-02-06")

	defer r.Body.Close()
}

func main() {
	router = mux.NewRouter()
	router.HandleFunc("/", home).Methods("GET")
	//router.HandleFunc("/", insert).Methods("POST")

	router.HandleFunc("/", readBody).Methods("POST")
	router.HandleFunc("/", readBody).Methods("OPTIONS")
	router.HandleFunc("/version", showVer).Methods("GET")
	router.HandleFunc("/countryCurrency", getCuntryCurrency).Methods("GET")

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
