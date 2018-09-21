import React from "react"
import TripRowInput from "./TripRowInput"
class Form extends React.Component {
  state = {
    transportType: "",
    tripDetails: [{country:"", destinationC:"", startTime:"", endTime:"", borderTime:""}]
  }
handleChange = (e) => {
    //if (["name", "age"].includes(e.target.className) ) {
    if (["country", "destinationC", "startTime", "endTime", "borderTime"].includes(e.target.className) ) {
      let tripDetails = [...this.state.tripDetails]
      tripDetails[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
      this.setState({ tripDetails }, () => console.log(this.state.transportType))
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    }
  }
addTrip = (e) => {
    this.setState((prevState) => ({
      tripDetails: [...prevState.tripDetails, {country:"", destinationC:"", startTime:"", endTime:"", borderTime:""}],
    }));
  }


handleSubmit = (e) => { 
    // console.log(
    //     this.state.transportType,
    //     this.state.tripDetails)
    e.preventDefault()
    let response = {
        transportType: this.state.transportType,
        roundTrip: this.state.tripDetails
    }
    console.log((JSON.stringify(response)))

    //send POST request to backend server
    fetch('http://localhost:8080/', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',                  
      },
      body: JSON.stringify(response)
    });

}
render() {
    let {transportType, tripDetails} = this.state
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
        <label htmlFor="transportType">Środek lokomocji</label> 
        <input type="text" name="transportType" id="transportType" value={transportType} />
        <button onClick={this.addTrip}>Dodaj nowy wiersz</button>
        <TripRowInput tripDetails={tripDetails} />
        <input type="submit" value="Submit" /> 
      </form>
    )
  }
}
export default Form 