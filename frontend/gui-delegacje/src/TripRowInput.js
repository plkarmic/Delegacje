// src/components/CatInputs.js
import React from "react"
import './TripRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const TripRowInput = (props) => {
  return (
    props.tripDetails.map((val, idx)=> {
      let countryId = `country-${idx}`, destinationCId = `destinationC-${idx}`, startTimeID = `startTime-${idx}`, endTimeID = `endTime-${idx}`, borderTimeID = `borderTime-${idx}`, cityId = `city-${idx}`, cityDId = `cityD-${idx}`
      return (
        <tr key={idx}>
          <td htmlFor={countryId}>
            <input
              type="text"
              name={countryId}
              data-id={idx}
              id={countryId}
              value={props.tripDetails[idx].country} 
              className="country"
            />
          </td>
          <td htmlFor={cityId}>
            <input
              type="text"
              name={cityId}
              data-id={idx}
              id={cityId}
              value={props.tripDetails[idx].city} 
              className="city"
            />
          </td>
          <td htmlFor={startTimeID}>
            <input
              type="datetime-local"
              name={startTimeID}
              data-id={idx}
              id={startTimeID}
              value={props.tripDetails[idx].startTime} 
              className="startTime"
            />
          </td>
          <td htmlFor={destinationCId}>
            <input
              type="text"
              name={destinationCId}
              data-id={idx}
              id={destinationCId}
              value={props.tripDetails[idx].destinationC} 
              className="destinationC"
            />
          </td>
          <td htmlFor={cityDId}>
            <input
              type="text"
              name={cityDId}
              data-id={idx}
              id={cityDId}
              value={props.tripDetails[idx].cityD} 
              className="cityD"
            />
          </td>
          <td htmlFor={endTimeID}>
            <input
              type="datetime-local"
              name={endTimeID}
              data-id={idx}
              id={endTimeID}
              value={props.tripDetails[idx].endTime} 
              className="endTime"
            />
          </td>
          <td htmlFor={endTimeID}>
            <input
              type="datetime-local"
              name={borderTimeID}
              data-id={idx}
              id={borderTimeID}
              value={props.tripDetails[idx].borderTime} 
              className="borderTime"
            />
          </td>
        </tr>
      )
    })
  )
}
export default TripRowInput