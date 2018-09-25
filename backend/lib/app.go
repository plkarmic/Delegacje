package app

import (
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/tidwall/gjson"
)

type RowTrip struct {
	CountryFrom string //start point
	CountryTo   string //destination point
	StartTime   time.Time
	ArrivalTime time.Time
	BorderTime  time.Time
}
type Expanses struct {
	Remark  string
	CostV   float64
	CostPLN float64
}

type Trip struct {
	startTime       time.Time
	endTime         time.Time
	transportType   string    //car, plain, train, etc
	destination     string    //destination country
	details         []RowTrip //array of strings with information for each trip details (time of departure, time of arrival,  boarder cross date, etc.)
	expansesDetails []Expanses
	durtion         float64
	totalCost       float64
}

func Cena(time float64, country string) float64 {
	//var Countryquerry string
	//var Countrypricequerry string
	//var Countrycurrencyquerry string
	var result float64
	//var days int
	var modulo int

	jsonFile, _ := os.Open("CountryTable1.json")
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	// var Kraj Countries
	// json.Unmarshal(byteValue, &Kraj)
	bodySTR := string(byteValue)
	fmt.Println(bodySTR)
	// roundTripNbr = gjson.Get(rawData, "roundTrip.#").String()
	// strTmp, _ := strconv.Atoi(roundTripNbr) //convert string to Int, then remove 1 as the first row is 0

	//Countryquerry := country+
	Countrypricequerry := country + ".0.kwota"
	//Countrycurrencyquerry := country + ".0.waluta"
	countryPrice := gjson.Get(bodySTR, Countrypricequerry).Float()
	//countryCurrency := gjson.Get(bodySTR, Countrycurrencyquerry).String()
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
						result = float64(int(countryPrice) * days)
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
			result = countryPrice / 3

		} else {
			if time >= 8 && time < 12 {

				result = countryPrice / 2
			} else {
				if time >= 12 && time <= 24 {
					result = countryPrice
				} else {
					if time > 24 {
						days := int(time / 24)

						result = float64(int(countryPrice) * days)
						if modulo < 8 {
							result = result + (countryPrice / 3)
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
	}

	return result

}

func Calculate(trip Trip) float64 { //MAGIC :)

	var czas time.Duration
	//var prevBorderDate time.Time //use to track borderDate from previous row
	var j int
	//var airplane int = 0
	var zeroDay, _ = time.Parse("01/02/2006 15:04", "01/01/0001 00:00")
	var price float64
	var dieta float64

	//prevBorderDate = zeroDay

	//to chyba nie ma sensu

	// //ustalanie cen per wiersz
	// 		if trip.details[i].CountryFrom == trip.details[i].CountryTo {
	// 			//price = pricing(trip.details[i].countryfrom)

	// 		}else {
	// 			//price = pricing(trip.details[i].CountryTo)
	// 		}

	//**Dla pierwszego wiersza
	// if trip.details[0].CountryFrom == "Polska" {
	// 	if trip.details[0].BorderTime == zeroDay {
	// 		trip.details[0].BorderTime = trip.details[0].ArrivalTime
	// 		czas = trip.details[0].BorderTime.Sub(trip.details[0].StartTime)
	// 		// price = Cena(czas,Polska)
	// 		dieta = (czas * price)
	// 	}
	// 	trip.details[0].BorderTime = trip.details[0].ArrivalTime
	// 	czas = trip.details[0].BorderTime.Sub(trip.details[0].StartTime)
	// 	price = Cena(czas, Polska)
	// 	dieta = (czas * price)

	for i := range trip.details {
		if i == 0 {
			if trip.details[i].CountryFrom == "Polska" { //zbedne poniższy else też obliczy diete dla Polska
				if trip.details[i].BorderTime == zeroDay {
					trip.details[i].BorderTime = trip.details[i].ArrivalTime
				}
				czas = trip.details[i].BorderTime.Sub(trip.details[i].StartTime)
				price = Cena(czas.Hours(), "Polska")
				dieta = price

			} else {
				if trip.details[i].BorderTime == zeroDay {
					trip.details[i].BorderTime = trip.details[i].ArrivalTime
					// czas = trip.details[i].StartTime.Sub(trip.details[i].BorderTime)
					// price = Cena(czas.Hours(), trip.details[i].CountryFrom)
					// dieta += price
				}
				czas = trip.details[i].StartTime.Sub(trip.details[i].BorderTime)
				price = Cena(czas.Hours(), trip.details[i].CountryFrom)
				dieta += price

			}
		} else {
			if trip.details[i].BorderTime == zeroDay {
				trip.details[i].BorderTime = trip.details[i].ArrivalTime
				//sprawdzenie czy kraj ostatniego przyjazdu jest taki sam jak kraj przyjazdu dla tego wiersza
				if trip.details[i].CountryTo == trip.details[i-1].CountryTo {
					czas += trip.details[i].BorderTime.Sub(trip.details[i-1].StartTime)
					price = Cena(czas.Hours(), trip.details[i].CountryFrom)
					dieta = price
				} else {
					czas = trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
					price = Cena(czas.Hours(), trip.details[i].CountryFrom)
					//czas1 := czas.Hours()
					dieta += price
				}
			} else {
				czas = trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
				price = Cena(czas.Hours(), trip.details[i].CountryFrom)
				dieta += price
			}
		}
		j = i
	}
	if trip.details[j].CountryTo == "Polska" && trip.details[j].BorderTime != zeroDay {
		czas = trip.details[j].ArrivalTime.Sub(trip.details[j].BorderTime)
		price = Cena(czas.Hours(), trip.details[j].CountryTo)
		dieta += price
	}
	// for i := range trip.details {
	// 	if trip.details[i].BorderTime != zeroDay { //sprawdzic wartosc zmiennej w przypadku przekazania pustego ciągu z formularza -> funkcja getTripDetails: ustawic zeroDay
	// 		if prevBorderDate == zeroDay && i == 0 {
	// 			dieta = trip.details[i].BorderTime.Sub(trip.details[i].StartTime)
	// 			//price = dieta*price (trip.details[i].)
	// 			// prevBorderDate = trip.details[i].BorderTime
	// 		} else if airplane == 1 {
	// 			dieta += trip.details[i].BorderTime.Sub(trip.details[i].startTime)
	// 		} else {
	// 			dieta += trip.details[i].BorderTime.Sub(trip.details[i-1].BorderTime)
	// 		}
	// 	} else { //brak przekroczenia granicy w pierwszym wierszu - samolot?
	// 		dieta = trip.details[i].ArrivalTime.Sub(trip.details[0].StartTime)
	// 		airplane = 1
	// 	}

	// 	j = i
	// }
	// if airplane == 0 {
	// 	if trip.details[j].BorderTime != zeroDay { //jeśli wrócił samochodem tak jak przyjechal
	// 		dieta += trip.details[j].ArrivalTime.Sub(trip.details[j].BorderTime)
	// 	} else { // wrocil samolotem i nie ma przekroczenia granicy w drodze powrotnej
	// 		dieta += trip.details[j].ArrivalTime.Sub(trip.details[j-1].BorderTime)
	// 	}

	// }

	return dieta
}
