import React from "react"
import TripRowInput from "./TripRowInput"
import AdditionalExpansesRowInput from "./AdditionalExpansesRowInput"
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
    kurs: ""

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
      this.setState({expansesDetails}, () => console.log(this.state.expansesDetails))
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    }
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

    //GET NBP DATA
    let outNBP = fetch('http://api.nbp.pl/api/exchangerates/rates/A/EUR/', {
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
render() {
    let {transportType, tripDetails, expansesDetails} = this.state
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
        <table class="table">
          <tbody>
            <tr>
              <div className="row">
                <div className="col-lg-2">
                  <td><h4><label htmlFor="transportType">Środek lokomocji</label></h4> </td>
                </div>
                <div className="col-lg-2">
                  <td> <input type="text" className="transportType" name="transportType" id="transportType" value={transportType}/></td>
                </div>
                <div className="col-lg-8"/>
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
              <td colSpan='3' className="text-center"><h4><label>Wyjazd</label></h4></td>
              <td colSpan='3' className="text-center"><h4><label>Przyjazd</label></h4></td>
              <td className="text-center"><h4><label>Przekroczenie granicy</label></h4></td>
            </tr>
            <tr>
              <th className="text-center"><label>Kraj</label></th>
              <th className="text-center"><label>Miejscowość</label></th>
              <th className="text-center"><label>Data i godzina</label></th>
              <th className="text-center"><label>Kraj</label></th>
              <th className="text-center"><label>Miejscowość</label></th>
              <th className="text-center"><label>Data i godz.</label></th>
              <th className="text-center"><label>Data i godz.</label></th>
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
                <th className="text-center" width="20%"><label>Kwota Waluta</label></th>
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
              <div className="row">
                  <div className="col-lg-8"><span className="pull-right"><label><h3>Kurs {this.state.waluta} według Tablea nr {this.state.tabelaNBP}: </h3></label></span></div>
                  <div className="col-lg-4"><label><h3><input className="result" value={this.state.kurs} onChange={"aaa"}></input></h3></label></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2">
            </div>
            <div className="col-lg-2">
              {/* <button onClick={this.addTrip} className="btn btn-info">Dodaj nowy wiersz</button> */}
            </div>
            <div className="col-lg-6">
              <div className="row">
                  <div className="col-lg-6"><span className="pull-right"><label><h3>Razem</h3></label></span></div>
                  <div className="col-lg-4"><label><h3><input className="result" value={this.state.total} onChange={"aaa"}></input></h3></label></div>
              </div>
            </div>
          </div>
        </div>
        
      </form>
    )
  }
}
export default Form 