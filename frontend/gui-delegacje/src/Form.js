import React from "react"
import TripRowInput from "./TripRowInput"
import AdditionalExpansesRowInput from "./AdditionalExpansesRowInput"
import FirstPage from "./firstPage.js"
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'
import './Form.css'

class Form extends React.Component {
  
  state = {
    transportType: "",
    tripDetails: [{country:"", destinationC:"", startTime:"", endTime:"", borderTime:""}],
    expansesDetails: [{remark:"", costV:"",costPLN:""}],
    total: "",
    waluta: "EUR",
    tabelaNBP: "",
    kurs: "",
    zaliczka: [{data:"", nrDow:"", waluta:"", slownie:"", pieczec:""}],
    test: "",
    person: [{name:"", to:"",timeFrom:"",timeTo:"",reason:""}],

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
    if (["country", "city", "destinationC", "cityD", "startTime", "endTime", "borderTime"].includes(e.target.className) ) {
      let tripDetails = [...this.state.tripDetails]
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
    }else if (["userNameForm name", "userNameForm to", "userNameForm timeFrom", "userNameForm timeTo", "userNameForm reason"].includes(e.target.className)){
      let person = [...this.state.person]
      person[0][e.target.className.substr(13)] = e.target.value.toUpperCase()
      console.log(person)
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    }
    
  
  
    //GET NBP DATA
    let outNBP = fetch('http://api.nbp.pl/api/exchangerates/rates/A/' + this.state.waluta, {
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
    })
  
  
  
  }
addTrip = (e) => {
    this.setState((prevState) => ({
      tripDetails: [...prevState.tripDetails, {country:"", destinationC:"", startTime:"", endTime:"", borderTime:""}],
    }));
  }
addExpanses = (e) => {
  this.setState((prevState) => ({
    expansesDetails: [...prevState.expansesDetails, {remark:"", costV:"", costPLN:""}],
  }));
  }

addZaliczka = (e) => {
  this.setState((prevState) => ({
    zaliczka: [...prevState.zaliczka, {data:"", nrDow:"", waluta:"", slownie:"", pieczec:""}],
  }));
  }

handleSubmit = (e) => { 
    console.log(
        this.state.transportType,
        this.state.tripDetails)
    e.preventDefault()
    let response = {
        transportType: this.state.transportType,
        roundTrip: this.state.tripDetails,
        expansesDetails: this.state.expansesDetails,
        duration: this.state.total
    }
    console.log((JSON.stringify(response)))

    //send POST request to backend server
    let out = fetch('http://localhost:8080/', {
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
      this.state.total = "aa"
      return ({
        type: "GET_CALL",
        res: res,
      });
    })
    .then(out => {
      console.log(out.res)
      this.setState({total: out.res});
    });

    console.log(this.state.total)

}
render() {
    let {transportType, tripDetails, expansesDetails, waluta, zaliczka, person} = this.state
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
              <div className="row hidden-print">
                <div className="col-xs-2 col-md-2 hidden-print">
                  <td><h4><label htmlFor="transportType" className="hidden-print">Środek lokomocji</label></h4> </td>
                </div>
                <div className="col-xs-4 col-md-4 hidden-print">
                  <td> <input type="text" className="transportType" name="transportType" id="transportType" value={transportType}/></td>
                </div>
                <div className="col-xs-6 col-md-6 print-only"> 
                  <label>Środek lokomocji: {this.state.transportType}</label>
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
              <td colSpan='3' className="col-xs-5 col-md-5 text-center"><h5><label>Wyjazd</label></h5></td>
              <td colSpan='3' className="col-xs-5 col-md-5 text-center"><h5><label>Przyjazd</label></h5></td>
              <td className="col-xs-2 col-md-2 text-center"><h5><label>Przekroczenie granicy</label></h5></td>
            </tr>
            <tr>
              <td className="text-center"><label className="print-width-th">Kraj</label></td>
              <td className="text-center"><label>Miejscowość</label></td>
              <td className="text-center"><label>Data i godzina</label></td>
              <td className="text-center"><label className="print-width-th">Kraj</label></td>
              <td className="text-center"><label className="print-width-th">Miejscowość</label></td>
              <td className="text-center"><label className="print-width-th2">Data i godz.</label></td>
              <td className="text-center"><label className="print-width-th2">Data i godz.</label></td>
            </tr>
          </thead>
          <tbody>
            <TripRowInput tripDetails={tripDetails} />
          </tbody>
        </table>
        <div className="row">
          <div className="col-lg-2">
            
            <input type="submit" value="Oblicz" className="btn btn-success"/> 
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
          <div className="row">
            <div className="col-lg-2">
            </div>
            <div className="col-lg-2">
              {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
            </div>
            <div className="col-lg-8">
            <div className="row"><br></br></div>
              <div className="row"> 
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {this.state.waluta} według Tablea nr {this.state.tabelaNBP}: {this.state.kurs}</label></span></div>
                  {/* <div className="col-lg-4"><label><h3><input className="result" value={this.state.kurs} onChange={"aaa"}></input></h3></label></div> */}
              </div>
            </div>
          </div>
          <div className="row">
                  <div className="col-xs-12 col-md-12"><span className="pull-right"><label><h3>Razem: {this.state.total}</h3></label></span></div>
                  {/* <div className="col-lg-4"><label><h3><input className="result" value={this.state.total}></input></h3></label></div> */}
          </div>
        </div>
        <div className="footer">
                <div className="col-xs-6 col-md-6">
                  <div> <label>Jednocześnie oświadczam, że korzystałem/nie <br/> korzystałem z bezpłatnego zakwaterowania wyżywienia.</label> </div>
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