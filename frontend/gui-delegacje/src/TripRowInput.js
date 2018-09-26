// src/components/CatInputs.js
import React from "react"
import './TripRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const TripRowInput = (props) => {
  return (
    props.tripDetails.map((val, idx)=> {
      let countryId = `country-${idx}`, destinationCId = `destinationC-${idx}`, startTimeID = `startTime-${idx}`, endTimeID = `endTime-${idx}`, borderTimeID = `borderTime-${idx}`, cityId = `city-${idx}`, cityDId = `cityD-${idx}`, transportTypeID=`transportType-${idx}`
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
            <label className="country-printOnly">
              {props.tripDetails[idx].country} 
            </label>
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
            <label className="city-printOnly">
              {props.tripDetails[idx].city} 
            </label>
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
            <label className="startTime-printOnly">
              {props.tripDetails[idx].startTime} 
            </label>
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
            <label className="destinationC-printOnly">
              {props.tripDetails[idx].destinationC} 
            </label>
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
             <label className="cityD-printOnly">
              {props.tripDetails[idx].cityD} 
            </label>
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
            <label className="endTime-printOnly">
              {props.tripDetails[idx].endTime} 
            </label>
          </td>
          <td htmlFor={borderTimeID}>
            <input
              type="datetime-local"
              name={borderTimeID}
              data-id={idx}
              id={borderTimeID}
              value={props.tripDetails[idx].borderTime} 
              className="borderTime"
            />
            <label className="borderTime-printOnly">
              {props.tripDetails[idx].borderTime} 
            </label>
          </td>
          <td htmlFor={transportTypeID} className="hidden-print">
            <input
              type="text"
              name={transportTypeID}
              data-id={idx}
              id={transportTypeID}
              value={props.tripDetails[idx].transportType} 
              className="transportType"
            />
            {/* <label className="borderTime-printOnly">
              {props.tripDetails[idx].borderTime} 
            </label> */}
          </td>
        </tr>
      )
    })
  )
}
export default TripRowInput