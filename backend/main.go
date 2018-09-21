package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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
	CountryFrom string //start point
	CountryTo   string //destination point
	StartTime   time.Time
	ArrivalTime time.Time
	BorderTime  time.Time
}

type Trip struct {
	startTime     time.Time
	endTime       time.Time
	transportType string    //car, plain, train, etc
	destination   string    //destination country
	details       []RowTrip //array of strings with information for each trip details (time of departure, time of arrival,  boarder cross date, etc.)
	durtion       float64
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

	//ECHO for test purposes ONLY
	fmt.Fprint(w, tripData)

	defer r.Body.Close()

}

func getTripDetails(rawData string) Trip {
	var trip Trip
	var rowDetail RowTrip
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

	tripDetail := gjson.Get(rawData, "roundTrip")
	tripDetail.ForEach(func(key, value gjson.Result) bool { //populate trip details in trip struct
		println(value.String())
		//trip.details = make(RowTrip, 0)

		rowDetail.StartTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "startTime").String())
		rowDetail.ArrivalTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "endTime").String())
		rowDetail.BorderTime, _ = time.Parse(dataLayout, gjson.Get(value.String(), "borderTime").String())
		rowDetail.CountryTo = gjson.Get(value.String(), "destinationC").String()
		rowDetail.CountryFrom = gjson.Get(value.String(), "country").String()
		trip.details = append(trip.details, rowDetail)
		return true
	})

	trip.durtion = calculate(trip).Hours()
	return trip

}

func calculate(trip Trip) time.Duration { //MAGIC :)

	var dieta time.Duration
	var prevBorderDate time.Time //use to track borderDate from previous row
	var j int
	var zeroDay, _ = time.Parse("2006-01-02T15:04", "0001/01/01T00:00")

	prevBorderDate = zeroDay

	for i := range trip.details {
		if trip.details[i].BorderTime != zeroDay { //sprawdzic wartosc zmiennej w przypadku przekazania pustego ciągu z formularza -> funkcja getTripDetails: ustawic zeroDay
			if prevBorderDate == zeroDay && i == 0 {
				dieta = trip.details[i].BorderTime.Sub(trip.details[i].StartTime)
				// prevBorderDate = trip.details[i].BorderTime
			} else {
				dieta += trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)

			}
		}
		j = i
	}
	dieta += trip.details[j].ArrivalTime.Sub(trip.details[j].BorderTime)

	return dieta
}

func main() {
	router = mux.NewRouter()
	router.HandleFunc("/", home).Methods("GET")
	//router.HandleFunc("/", insert).Methods("POST")

	router.HandleFunc("/", readBody).Methods("POST")

	corsObj := handlers.AllowedOrigins([]string{"*"})

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(corsObj)(router)))

}
