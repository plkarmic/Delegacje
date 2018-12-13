import React from "react"
import TripRowInput from "./TripRowInput"
import AdditionalExpansesRowInput from "./AdditionalExpansesRowInput"
import FirstPage from "./firstPage.js"
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'
import './Form.css'

class Form extends React.Component {
  
  state = {
    transportTypeAll: "Samochód",
    tripDetails: [{country:"", destinationC:"", startTime:"", endTime:"", borderTime:"", transportType: ""}],
    expansesDetails: [{remark:"", costV: "", costPLN: ""}],
    total: "",
    totalV: "",
    totalPLN: "",
    waluta: "EUR",
    tabelaNBP: "",
    tabelaNBPData: "",
    kurs: "",
    zaliczka: [{data:"", nrDow:"", waluta:"", slownie:"", pieczec:"", kwota:0}],
    test: "",
    person: [{name:"", to:"",timeFrom:"",timeTo:"",reason:""}],
    ryczaltWyzywienie: 1,
    ryczaltWyzywienieDetale: "FULL",
    sniadanieCount: 0,
    obiadyCount: 0,
    kolacjeCount: 0,
    ryczaltDoajzdyBagaze: 0,
    ryczaltDojazdyKomunikacja: 0,
    ryczaltNoclegi: 0,
    tripDuration: "",
    kursError: 0,

    outNBP: fetch('http://api.nbp.pl/api/exchangerates/rates/A/' + 'EUR', {
      method: 'GET',
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        //'Content-Type': 'application/json',
        //'Accept': 'application/json',                  
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      return ({
        type: "GET_CALL",
        res: res,
      });
    })
    .then(out => {
      console.log(out.res.code)
      this.setState({
        kurs: out.res.rates[0].mid,
        tabelaNBP: out.res.rates[0].no
      })
    }),

    values: fetch('http://api.nbp.pl/api/exchangerates/tables/A', {
      method: 'GET',
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        //'Content-Type': 'application/json',
        //'Accept': 'application/json',                  
      }
    })
    .then(res => res.json())
    .then(res => {
      //console.log(res)
      return ({
        type: "GET_CALL",
        res: res,
      });
    })
    .then(out => {
      //console.log(out.res[0].rates.code)
      for (var i in out.res[0].rates)
      {
        console.log(out.res[0].rates[i].code)
      }
      // this.setState({
      //   kurs: out.res.rates[0].mid,
      //   tabelaNBP: out.res.rates[0].no
     // })
    })
  
  }


handleChange = (e) => {
    //if (["name", "age"].includes(e.target.className) ) {
    let ryczaltDoajzdyBagaze = this.state.ryczaltDoajzdyBagaze
    let ryczaltDojazdyKomunikacja = this.state.ryczaltDojazdyKomunikacja
    let ryczaltNoclegi = this.state.ryczaltNoclegi
    let tripDetails = [...this.state.tripDetails]
    let zaliczka = [...this.state.zaliczka]
    if (["country", "city", "destinationC", "cityD", "startTime", "endTime", "borderTime", "transportType"].includes(e.target.className) ) {
      // let tripDetails = [...this.state.tripDetails]
      tripDetails[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
      this.setState({ tripDetails }, () => console.log(this.state.transportType))
    }else if (["remark", "costV", "costPLN"].includes(e.target.className)){
      let expansesDetails = [...this.state.expansesDetails]
      expansesDetails[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
      if(expansesDetails[e.target.dataset.id]["costV"] !== ''){
        expansesDetails[e.target.dataset.id]["costPLN"] = expansesDetails[e.target.dataset.id][e.target.className] * this.state.kurs
      }
      this.setState({expansesDetails}, () => console.log(this.state.expansesDetails))
    }else if (["userNameForm data", "userNameForm nrDow", "userNameForm waluta", "userNameForm kwota", "userNameForm slownie"].includes(e.target.className)) {
      zaliczka[e.target.dataset.id][e.target.className.substr(13)] = e.target.value.toUpperCase()
      this.setState({ zaliczka}, () => console.log(this.state.zaliczka))
    }else if (["userNameForm name", "userNameForm to", "userNameForm timeFrom", "userNameForm timeTo", "userNameForm reason"].includes(e.target.className)){
      let person = [...this.state.person]
      person[0][e.target.className.substr(13)] = e.target.value.toUpperCase()
      this.setState({ person }, () => console.log(this.state.person))
    } else if (["transportTypeAll"].includes(e.target.className)) {
      let transportTypeAll = [...this.state.transportTypeAll]
      transportTypeAll = e.target.value
      this.setState({[e.target.name]: e.target.value.toUpperCase()})
      for(var i = 0; i < tripDetails.length; i++)
      {
        tripDetails[i]["transportType"] = e.target.value.toUpperCase()
      }
      this.setState({ tripDetails }, () => console.log(this.state.transportType))
      console.log(transportTypeAll)
    } else if (["ryczaltWyzywienie"].includes(e.target.className))  {
      let ryczaltWyzywienie = this.state.ryczaltWyzywienie
      ryczaltWyzywienie = e.target.value
      this.setState({ ryczaltWyzywienie })
    }else if (["ryczaltWyzywienieDetale"].includes(e.target.className))  {
      let ryczaltWyzywienieDetale = this.state.ryczaltWyzywienieDetale
      ryczaltWyzywienieDetale = e.target.value
      this.setState({ ryczaltWyzywienieDetale }) 
    }else if(["sniadanieCount"].includes(e.target.className)) {
      let sniadanieCount = this.state.sniadanieCount
      sniadanieCount = e.target.value
      this.setState({sniadanieCount})
    }else if(["obiadyCount"].includes(e.target.className)) {
      let obiadyCount = this.state.obiadyCount
      obiadyCount = e.target.value
      this.setState({obiadyCount})
    }else if(["kolacjeCount"].includes(e.target.className)) {
      let kolacjeCount = this.state.kolacjeCount
      kolacjeCount = e.target.value
      this.setState({kolacjeCount})
    }else if(["rybagdojazdy"].includes(e.target.className)) {
      ryczaltDoajzdyBagaze = e.target.value
      this.setState({ ryczaltDoajzdyBagaze: e.target.value })
    }else if(["rydojkom"].includes(e.target.className)) {
      ryczaltDojazdyKomunikacja = e.target.value
      this.setState({ ryczaltDojazdyKomunikacja: e.target.value })
    } else if(["rynoc"].includes(e.target.className)) {
      ryczaltNoclegi = e.target.value
      this.setState({ ryczaltNoclegi: e.target.value })
    }
    else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    }
    
    //GET NBP DATA

    var startDate = new Date()
    startDate.setDate(startDate.getDate() - 10)
    var endDate = new Date()
    endDate.setDate(endDate.getDate() - 1)
    var startDateDay
    var endDateDay
    var startDateMonth
    var endDateMonth
  
    // var dataZaliczka = new Date()
    if(zaliczka[0].data !== "")
    {
      console.log("jest zaliczka")
      // dateZaliczka = new Date(zaliczka[0].data)
      startDate = new Date(zaliczka[0].data)
      startDate.setDate(startDate.getDate() - 10)
      endDate = new Date(zaliczka[0].data)
      endDate.setDate(endDate.getDate())
    
      console.log("startDate: " +startDate)
      console.log("endDate: " + endDate)

    }



    if (startDate.getDate() < 10) {
      startDateDay = '0' + startDate.getDate()
    } else {
      startDateDay = startDate.getDate()
    }

    if ((startDate.getMonth() + 1) < 10) {
      startDateMonth = '0' + (startDate.getMonth() + 1) 
    } else {
      startDateMonth = (startDate.getMonth() + 1) 
    }

    startDate = startDate.getFullYear() + "-" + startDateMonth + "-" + startDateDay

    if (endDate.getDate() < 10) {
      endDateDay = '0' + endDate.getDate()
    } else {
      endDateDay = endDate.getDate()
    }

    if ((endDate.getMonth() + 1) < 10) {
      endDateMonth = '0' + (endDate.getMonth() + 1) 
    } else {
      endDateMonth = (endDate.getMonth() + 1) 
    }

    endDate = endDate.getFullYear() + "-" + endDateMonth + "-" + endDateDay

    let NBPQuery = 'http://api.nbp.pl/api/exchangerates/rates/A/' + this.state.waluta + '/' + startDate + '/' + endDate

    let outNBP = fetch(NBPQuery, {
      method: 'GET',
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        //'Content-Type': 'application/json',
        //'Accept': 'application/json',                  
      } 
    })
    .then(res => res.json())
    .then(res => {
      return ({
        type: "GET_CALL",
        res: res,
      });
    })
    .then(out => {
      let kursNBP, tabelaNBP, tabelaNBPData
       var date = new Date()
      // // var startDate = new Date()
      // // startDate.setDate(startDate.getDate() - 10)
      // // var endDate = new Date()
      // // endDate.setDate(endDate.getDate() - 1)
      // // var startDateDay
      // // var endDateDay
    
      

      // // if (startDate.getDate() < 10) {
      // //   startDateDay = '0' + startDate.getDate()
      // // } else {
      // //   startDateDay = startDate.getDate()
      // // }
      // // startDate = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDateDay

      // // if (endDate.getDate() < 10) {
      // //   endDateDay = '0' + endDate.getDate()
      // // } else {
      // //   endDateDay = endDate.getDate()
      // // }
      // // endDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDateDay

      // console.log("StartDate: " + startDate)
      // console.log("EndDate: " + endDate)


      if(out.res.rates[1].effectiveDate !== date)
      {
        kursNBP = out.res.rates[1].mid
        tabelaNBP = out.res.rates[1].no
      } else {
        kursNBP = out.res.rates[0].mid
        tabelaNBP = out.res.rates[0].no
      }

      //ostatnia dostepna wartosc - w przypadku daty pobrania zaliczki

      kursNBP = out.res.rates[(out.res.rates.length - 1)].mid
      tabelaNBP = out.res.rates[(out.res.rates.length - 1)].no

      //wartos z dnia poprzedniego w przeciwnym wypadku
      if(out.res.rates[(out.res.rates.length - 1)].effectiveDate !== date)
      {
        kursNBP = out.res.rates[(out.res.rates.length - 1)].mid
        tabelaNBP = out.res.rates[(out.res.rates.length - 1)].no
        tabelaNBPData = out.res.rates[(out.res.rates.length - 1)].effectiveDate
      } else {
        kursNBP = out.res.rates[(out.res.rates.length - 2)].mid
        tabelaNBP = out.res.rates[(out.res.rates.length - 2)].no
        tabelaNBPData = out.res.rates[(out.res.rates.length - 2)].effectiveDate
      }

      console.log(kursNBP)
      console.log(tabelaNBP)
      this.setState({
          kurs: kursNBP,
          tabelaNBP: tabelaNBP,
          tabelaNBPData: tabelaNBPData
      })
    })

    console.log("result")
    console.log(this.state.kursError)
    if(this.state.kursError === -1) {console.log("brak danych")}
  
    let expansesDetailsAllV = 0
    {
      for (var i = 0; i < this.state.expansesDetails.length; i++) {
        if(parseFloat(this.state.expansesDetails[i].costV) > 0)
          expansesDetailsAllV += parseFloat(this.state.expansesDetails[i].costV)
      }
    }

    let expansesDetailsAllPLN = 0
    for (var i = 0; i < this.state.expansesDetails.length; i++) {
      var check = parseFloat(this.state.expansesDetails[i].costV) || 0
      if (parseFloat(this.state.expansesDetails[i].costPLN) > 0 && check === 0)
      expansesDetailsAllPLN += parseFloat(this.state.expansesDetails[i].costPLN) || 0
    }

    expansesDetailsAllV += (parseFloat(ryczaltDoajzdyBagaze) || 0) + (parseFloat(ryczaltDojazdyKomunikacja) || 0) + (parseFloat(ryczaltNoclegi) || 0)

    this.setState({totalV: expansesDetailsAllV})
    this.setState({totalPLN: expansesDetailsAllPLN})
  
  } 
addTrip = (e) => {
    this.setState((prevState) => ({
      tripDetails: [...prevState.tripDetails, {country:"", destinationC:"", startTime:"", endTime:"", borderTime:"", transportType:this.state.transportTypeAll}],
    }));
  }
addExpanses = (e) => {
  this.setState((prevState) => ({
    expansesDetails: [...prevState.expansesDetails, {remark:"", costV:"", costPLN:""}],
  }));
  }

addZaliczka = (e) => {
  this.setState((prevState) => ({
    zaliczka: [...prevState.zaliczka, {data:"", nrDow:"", waluta:"", slownie:"", pieczec:"", kwota:0}],
  }));
  }

handleSubmit = (e) => { 
    console.log(
        this.state.transportTypeAll,
        this.state.tripDetails,
        this.state.zaliczka)
    let zaliczkaTotal = 0
    for (var i =0; i < this.state.zaliczka.length; i++) {
      zaliczkaTotal += parseFloat(this.state.zaliczka[i].kwota)
    }
    let expansesDetailsAll = 0
    for (var i = 0; i < this.state.expansesDetails.length; i++) {
      expansesDetailsAll += parseFloat(this.state.expansesDetails[i].costPLN)
    }
    e.preventDefault()
    let response = {
        transportType: this.state.transportType,
        roundTrip: this.state.tripDetails,
        expansesDetails: this.state.expansesDetails,
        duration: this.state.total,
        ryczaltWyzywienie: this.state.ryczaltWyzywienie,
        ryczaltWyzywienieDetale: this.state.ryczaltWyzywienieDetale,
        sniadanieCount: this.state.sniadanieCount,
        obiadyCount: this.state.obiadyCount,
        kolacjeCount: this.state.kolacjeCount,
        ryczaltDoajzdyBagaze: this.state.ryczaltDoajzdyBagaze,
        ryczaltDojazdyKomunikacja: this.state.ryczaltDojazdyKomunikacja,
        ryczaltNoclegi: this.state.ryczaltNoclegi,
        exchangeRate: this.state.kurs
    }
    console.log((JSON.stringify(response)))

    //send POST request to backend server
    let out = fetch('http://wassv076.einstein.local:8080/', {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
          // 'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',                  
      },
      body: JSON.stringify(response)
    })
    .then(res => res.text())
    .then(res => {
      console.log(res)
      // this.state.total = "aa"
      return ({
        type: "GET_CALL",
        res: res,
      });
    })
    .then(out => {
      console.log(out.res)
      let s = out.res.split(";")
      this.setState({total: ((s[0] - zaliczkaTotal + (((parseFloat(this.state.ryczaltDoajzdyBagaze) || 0) + (parseFloat(this.state.ryczaltDojazdyKomunikacja) || 0) + (parseFloat(this.state.ryczaltNoclegi) || 0)) * this.state.kurs)) || 0).toFixed(2) + " PLN"}); //DODAC POLA Z BACKENDU

      var tripCostCurrency = 0

      let days = parseInt(s[1]/24)
      let hours = parseInt(s[1]%24)
      let minutes = parseInt((s[1]*60)%60)

      let tempDuration = days +" dni " + hours + " godzin(y)"
      if (minutes == 0) {
        minutes = ""
      }
      else if (minutes == 1) {
        minutes = minutes + " minutę"
      } else {
        minutes =  minutes + " minut(y)"
      }
      if (hours == 1)
      {
        tempDuration = days +" dni " + hours + " godzinę"
      }
      if (days == 1) 
      {
        tempDuration = days +" dzień " + hours + " godzin(y)"
        if (hours == 1)
        {
          tempDuration = days +" dzień " + hours + " godzinę"
        }
      }
      tempDuration = tempDuration + " " + minutes


      this.setState({tripDuration: tempDuration })


      for (var i = 0; i < this.state.expansesDetails.length; i++) {
        if(parseFloat(this.state.expansesDetails[i].costV) > 0)
          tripCostCurrency += parseFloat(this.state.expansesDetails[i].costV) || 0
          console.log(this.state.expansesDetails[i].costV)
      }

      tripCostCurrency += (parseFloat(s[2]) || 0) + (parseFloat(this.state.ryczaltDoajzdyBagaze) || 0) + (parseFloat(this.state.ryczaltDojazdyKomunikacja) || 0) + (parseFloat(this.state.ryczaltNoclegi) || 0)
      tripCostCurrency = tripCostCurrency.toFixed(2)

      this.setState({totalV: tripCostCurrency})
    });
    console.log(this.state.total)
    console.log(this.state.tripDuration)

}
render() {
    let {transportTypeAll, tripDetails, expansesDetails, waluta, zaliczka, person, ryczaltWyzywienie, ryczaltWyzywienieDetale, sniadanieCount, kolacjeCount, obiadyCount, ryczaltDoajzdyBagaze, ryczaltNoclegi, ryczaltDojazdyKomunikacja, totalPLN} = this.state
    let wyzywnienieTXT = "korzystałem"
    if (ryczaltWyzywienie === '0')
    {
      wyzywnienieTXT = "nie korzystałem"
    }
    
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange} >

        <FirstPage zaliczka={zaliczka} person={person}/>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <span class="pull-right"><button onClick={this.addZaliczka} className="btn btn-info">Dodaj zaliczke</button></span>
          </div>
          
        </div>
        <div className="row"></div>
        <div className="row"></div>
        <table class="table-no-border">
          <tbody>
            <tr>
              <div className="row">
                <div className="col-xs-2 col-md-2 hidden-print">
                  <td><h4><label htmlFor="transportType" className="hidden-print">Środek lokomocji</label></h4> </td>
                </div>
                <div className="col-xs-4 col-md-4 hidden-print">
                  <td> <input type="text" className="transportTypeAll" name="transportTypeAll" id="transportTypeAll" value={transportTypeAll}/></td>
                </div>
                <div className="col-xs-6 col-md-6 print-only"> 
                  <label>Środek lokomocji: {this.state.transportTypeAll}</label>
                </div>
              </div>
            </tr>
            <tr>
              <div className="row hidden-print">
                <div className="col-xs-2 col-md-2 hidden-print">
                  <td><h4><label htmlFor="waluta" className="hidden-print">Waluta</label></h4> </td>
                </div>
                <div className="col-xs-4 col-md-4 hidden-print">
                  <td> <input type="text" className="waluta" name="waluta" id="waluta" value={waluta}/></td>
                </div>
              </div>
            </tr>
          </tbody>
        </table>  
       
         
       <table name="formTable" id="formTable" className="table table-bordered table-condensed">
          {/* <tr>
            <td><label htmlFor="transportType">Środek lokomocji</label> </td>
            <td> <input type="text" name="transportType" id="transportType" value={transportType} /></td>
          </tr> */}
          <thead>
            <tr>
              <td colSpan='3' className="col-xs-4 col-md-4 text-center"><h5><label>Wyjazd</label></h5></td>
              <td colSpan='3' className="col-xs-4 col-md-4 text-center"><h5><label>Przyjazd</label></h5></td>
              <td className="col-xs-2 col-md-2 text-center"><h5><label>Przekroczenie granicy</label></h5></td>
              <td rowSpan='2' className="col-xs-2 col-md-2 text-center hidden-print"><h5><label>Śr. lokomocji</label></h5></td>
            </tr>
            <tr>
              <td className="text-center"><label className="print-width-th">Kraj</label></td>
              <td className="text-center"><label>Miejscowość</label></td>
              <td className="text-center"><label>Data i godzina</label></td>
              <td className="text-center"><label className="print-width-th">Kraj</label></td>
              <td className="text-center"><label className="print-width-th">Miejscowość</label></td>
              <td className="text-center"><label className="print-width-th2">Data i godz.</label></td>
              <td className="text-center"><label className="print-width-th2">Data i godz.</label></td>
              {/* <td className="text-center hidden-print"><label className="print-width-th2"></label></td> */}
            </tr>
          </thead>
          <tbody>
            <TripRowInput tripDetails={tripDetails} />
          </tbody>
        </table>
        <div className="row">
          <div className="col-lg-2">
            
            {/* <input type="submit" value="Oblicz" className="btn btn-success"/>  */}
          </div>
          <div className="col-lg-8">
            {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
          </div>
          <div className="col-lg-2">
            <span class="pull-right"><button onClick={this.addTrip} className="btn btn-info">Dodaj przejazd</button></span>
          </div>
        </div>        
        <div>
          <br/>  
        </div>
        <div className="row">
        <div className="col-xs-6 col-md-6"></div>
          <div className="col-xs-6 col-md-6">
            <span className="pull-right">
              Podroż trwała: {this.state.tripDuration}
            </span>
          </div>
        </div>
        <div>
          <br/>  
        </div>
        <div>
        <table name="formTable" id="formTable" className="table table-bordered table-condensed">
            <thead>
              <tr>
                <th colSpan="3" className="text-center"><label>Dodatkowe wydatki</label></th>
              </tr>
              <tr className="table table-bordered table-condensed">
                <th className="text-center" width="60%"><label>Opis/typ</label></th>
                <th className="text-center" width="20%"><label>Kwota {this.state.waluta}</label></th>
                <th className="text-center" width="20%"><label>Kwota PLN</label></th>
              </tr>
            </thead>
       
            <tbody>
              <AdditionalExpansesRowInput expansesDetails={expansesDetails} />
            </tbody>
            
          </table>
          <div className="row">
            <div className="col-lg-2">
            </div>
            <div className="col-lg-8">
              {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
            </div>
            <div className="col-lg-2">
              <span className="pull-right"><button onClick={this.addExpanses} className="btn btn-info">Dodaj wydatek</button> </span>
            </div>
          </div>
          <div className="row"><br></br></div>
          <div className="row">
            <div className="col-xs-7 col-md-7"></div>
            <div className="col-xs-5 col-md-5">
              <table className="table-condensed table-no-border" width="100%">
                <tbody>
                  <tr>
                    <td width="60%">Ryczały na bagażowych i dojazdy [{this.state.waluta}]</td>
                    <td width="40%">
                      <input type="number" step="0.01" className="rybagdojazdy" name="rybagdojazdy" id="rybagdojazdy"/>
                    </td>
                  </tr>
                  <tr>
                    <td width="60%">Ryczały na dojazdy komunikacją miejską [{this.state.waluta}]</td>
                    <td width="40%">
                      <input type="number" step="0.01" className="rydojkom" name="rydojkom" id="rydojkom"/>
                    </td>
                  </tr>
                  <tr>
                    <td width="60%" >Ryczałt za nocleg [{this.state.waluta}]</td>
                    <td width="40%">
                      <input type="number" step="0.01" className="rynoc" name="rynoc" id="rynoc"/>
                    </td>
                  </tr>
                  <tr className="hidden-print">
                    <td colSpan="2">
                      <td className="pull-right">
                        Oświadczam, że 
                          <select className="ryczaltWyzywienie" value={this.state.ryczaltWyzywienie}>
                            <option value="1" >korzystałam(em)</option>
                            <option value="0">nie korzystałam(em)</option>
                            </select>
                        z wyżywienia obejmującego:
                      </td>
                    </td>
                  </tr>
                  <tr className="hidden-print">
                      <td className="pull-right pull-right-center">śniadania</td>
                      <td>
                        <input type="number" className="sniadanieCount" name="sniadanieCount" id="sniadanieCount"/>
                      </td>
                  </tr>
                  <tr className="hidden-print">
                      <td className="pull-right pull-right-center">obiady</td>
                      <td>
                        <input type="number" className="obiadyCount" name="obiadyCount" id="obiadyCount"/>
                      </td>
                  </tr>
                  <tr className="hidden-print">
                      <td className="pull-right pull-right-center">kolacje</td>
                      <td>
                        <input type="number" className="kolacjeCount" name="kolacjeCount" id="kolacjeCount"/>
                      </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-2">
            </div>
            <div className="col-lg-2">
              {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
            </div>
            <div className="col-lg-8">
            <div className="row"><br></br></div>
            <div className="row">
            </div>
            <div className="row hidden-print">
            
             
            </div>
              <div className="row"> 
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {this.state.waluta} według Tablea nr {this.state.tabelaNBP} z dnia {this.state.tabelaNBPData}: {this.state.kurs}</label></span></div>
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Razem: {this.state.totalV} {this.state.waluta} </label></span></div>
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Razem: {totalPLN} PLN </label></span></div>
                  {/* <div className="col-lg-4"><label><h3><input className="result" value={this.state.kurs} onChange={"aaa"}></input></h3></label></div> */}
              </div>
            </div>
          </div>
          
        <div className="row">
          <div className="col-lg-2">
            <input type="submit" value="Oblicz" className="btn btn-danger btn-block"/> 
          </div>
          <div className="col-lg-8">
            {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
          </div>
          <div className="col-lg-2">
          </div>
        </div>

          <div className="row">
                  
                  {/* <div className="col-lg-4"><label><h3><input className="result" value={this.state.total}></input></h3></label></div> */}
          </div>
          <div className="row">
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label><h3>Do wypłaty: {this.state.total}</h3></label></span></div>
                  {/* <div className="col-lg-4"><label><h3><input className="result" value={this.state.total}></input></h3></label></div> */}
          </div>
        </div>
        
        <div className="footer">
                <div className="col-xs-6 col-md-6">
                  <div> <label>Jednocześnie oświadczam, {wyzywnienieTXT} <br/> z bezpłatnego zakwaterowania wyżywienia. <br /> (obejmującego: śniadania {sniadanieCount}, obiady: {obiadyCount}, kolacje {kolacjeCount})</label> </div>
                  <div> <br/></div>
                  <div><label>(data i podpis pracownika)</label> </div>
                </div>
                <div className="col-xs-6 col-md-6">
                  <div> <label>Stwierdzam wykonanie polecenia służbowego, <br/> należyte użycie czasu i środków lokomocji.</label> </div>
                    <div> <br/></div>
                    <div><label>(data i podpis przełożonego)</label> </div>
                </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <span className="version hidden-print">v1.1</span>
              </div>
            </div>
      </form>
      
    )
  }
}
export default Form 