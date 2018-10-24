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
      let zaliczka = [...this.state.zaliczka]
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
    let outNBP = fetch('http://api.nbp.pl/api/exchangerates/rates/A/' + this.state.waluta + '/last/2', {
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
      let kursNBP, tabelaNBP
      var date = new Date()
      var dateDay = date.getDate()
      if (dateDay < 10) {
        dateDay = '0' + date.getDate()
      }
      date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

      if(out.res.rates[1].EffectiveDate !== date)
      {
        kursNBP = out.res.rates[1].mid
        tabelaNBP = out.res.rates[1].no
      } else {
        kursNBP = out.res.rates[0].mid
        tabelaNBP = out.res.rates[0].no
      }
      console.log(kursNBP)
      console.log(tabelaNBP)
      this.setState({
          kurs: kursNBP,
          tabelaNBP: tabelaNBP
      })
    })
  
    let expansesDetailsAllV = 0
    {
      for (var i = 0; i < this.state.expansesDetails.length; i++) {
        if(parseInt(this.state.expansesDetails[i].costV) > 0)
          expansesDetailsAllV += parseInt(this.state.expansesDetails[i].costV)
      }
    }

    let expansesDetailsAllPLN = 0
    for (var i = 0; i < this.state.expansesDetails.length; i++) {
      var check = parseInt(this.state.expansesDetails[i].costV) || 0
      if (parseInt(this.state.expansesDetails[i].costPLN) > 0 && check === 0)
      expansesDetailsAllPLN += parseInt(this.state.expansesDetails[i].costPLN) || 0
    }

    expansesDetailsAllPLN = (parseInt(ryczaltDoajzdyBagaze) || 0) + (parseInt(ryczaltDojazdyKomunikacja) || 0) + (parseInt(ryczaltNoclegi) || 0)

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
      zaliczkaTotal += parseInt(this.state.zaliczka[i].kwota)
    }
    let expansesDetailsAll = 0
    for (var i = 0; i < this.state.expansesDetails.length; i++) {
      expansesDetailsAll += parseInt(this.state.expansesDetails[i].costPLN)
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
        ryczaltNoclegi: this.state.ryczaltNoclegi
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
      this.setState({total: out.res - zaliczkaTotal + " PLN"});
    });
    console.log(this.state.total)

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
                    <td width="50%">Ryczały na bagażowych i dojazdy</td>
                    <td width="50%">
                      <input type="number" className="rybagdojazdy" name="rybagdojazdy" id="rybagdojazdy"/>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%">Ryczały na dojazdy komunikacją miejską</td>
                    <td width="50%">
                      <input type="number" className="rydojkom" name="rydojkom" id="rydojkom"/>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%">Ryczałt za nocleg</td>
                    <td width="50%">
                      <input type="number" className="rynoc" name="rynoc" id="rynoc"/>
                    </td>
                  </tr>
                  <tr className="hidden-print">
                    <td colSpan="2">
                    Oświadczam, że 
                      <select className="ryczaltWyzywienie" value={this.state.ryczaltWyzywienie}>
                        <option value="1" >korzystałam(em)</option>
                        <option value="0">nie korzystałam(em)</option>
                        </select>
                    z wyżywienia obejmującego:
                    </td>
                  </tr>
                  <tr className="hidden-print">
                      <td>śniadania</td>
                      <td>
                        <input type="number" className="sniadanieCount" name="sniadanieCount" id="sniadanieCount"/>
                      </td>
                  </tr>
                  <tr className="hidden-print">
                      <td>obiady</td>
                      <td>
                        <input type="number" className="obiadyCount" name="obiadyCount" id="obiadyCount"/>
                      </td>
                  </tr>
                  <tr className="hidden-print">
                      <td>kolacje</td>
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
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {this.state.waluta} według Tablea nr {this.state.tabelaNBP}: {this.state.kurs}</label></span></div>
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
      </form>
    )
  }
}
export default Form 