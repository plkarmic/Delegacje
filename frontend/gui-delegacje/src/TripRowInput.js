// src/components/CatInputs.js
import React from "react"
const TripRowInput = (props) => {
  return (
    props.tripDetails.map((val, idx)=> {
      let countryId = `country-${idx}`, destinationCId = `destinationC-${idx}`, startTimeID = `startTime-${idx}`, endTimeID = `endTime-${idx}`, borderTimeID = `borderTime-${idx}`
      return (
        <div key={idx}>
          <label htmlFor={countryId}>{`Country #${idx + 1}`}</label>
          <input
            type="text"
            name={countryId}
            data-id={idx}
            id={countryId}
            value={props.tripDetails[idx].country} 
            className="country"
          />
          <label htmlFor={destinationCId}>KrajDocelowy</label>
          <input
            type="text"
            name={destinationCId}
            data-id={idx}
            id={destinationCId}
            value={props.tripDetails[idx].destinationC} 
            className="destinationC"
          />
          <label htmlFor={startTimeID}>Czas wyjazdu</label>
          <input
            type="datetime-local"
            name={startTimeID}
            data-id={idx}
            id={startTimeID}
            value={props.tripDetails[idx].startTime} 
            className="startTime"
          />
          <label htmlFor={endTimeID}>Czas przyjazdyu</label>
          <input
            type="datetime-local"
            name={endTimeID}
            data-id={idx}
            id={endTimeID}
            value={props.tripDetails[idx].endTime} 
            className="endTime"
          />
           <label htmlFor={endTimeID}>Czas przekroczenia granicy</label>
          <input
            type="datetime-local"
            name={borderTimeID}
            data-id={idx}
            id={borderTimeID}
            value={props.tripDetails[idx].borderTime} 
            className="borderTime"
          />
        </div>
      )
    })
  )
}
export default TripRowInput