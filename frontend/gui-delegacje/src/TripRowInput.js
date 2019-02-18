// src/components/CatInputs.js
import React from "react"
import './TripRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const TripRowInput = (props) => {
  return (
    props.tripDetails.map((val, idx)=> {
      let countryId = `country-${idx}`, destinationCId = `destinationC-${idx}`, startTimeID = `startTime-${idx}`, endTimeID = `endTime-${idx}`, borderTimeID = `borderTime-${idx}`, cityId = `city-${idx}`, cityDId = `cityD-${idx}`, cityBId = `cityB-${idx}`, transportTypeID=`transportType-${idx}`
      let timeTstart = (props.tripDetails[idx].startTime).replace("T", " ")
      let timeTend = (props.tripDetails[idx].endTime).replace("T", " ")
      let timeTborder = (props.tripDetails[idx].borderTime).replace("T", " ")
      return (
        <tbody>
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
        

          <td htmlFor={cityDId}>
            <input
              type="text"
              name={cityBId}
              data-id={idx}
              id={cityBId}
              value={props.tripDetails[idx].cityB} 
              className="cityB"
            />
             <label className="cityB-printOnly">
              {props.tripDetails[idx].cityB} 
            </label>
          </td>

         
           <td htmlFor={transportTypeID}>
            <input
              type="text"
              name={transportTypeID}
              data-id={idx}
              id={transportTypeID}
              value={props.tripDetails[idx].transportType} 
              className="transportType"
            />
            <label className="transportType-printOnly">
              {props.tripDetails[idx].transportType}
            </label>
          </td>
        </tr>
        <tr>
       
          <td colspan="2" htmlFor={startTimeID}>  
              <input
                type="datetime-local"
                name={startTimeID}
                data-id={idx}
                id={startTimeID}
                value={props.tripDetails[idx].startTime} 
                className="startTime"
              />
              <label className="startTime-printOnly">
                {timeTstart} 
              </label>
            </td>
         
          <td colSpan='2' htmlFor={endTimeID}>
            <input
              type="datetime-local"
              name={endTimeID}
              data-id={idx}
              id={endTimeID}
              value={props.tripDetails[idx].endTime} 
              className="endTime"
            />
            <label className="endTime-printOnly">
              {timeTend}
            </label>
          </td>

            <td colSpan='2' htmlFor={borderTimeID}>
              <input
                type="datetime-local"
                name={borderTimeID}
                data-id={idx}
                id={borderTimeID}
                value={props.tripDetails[idx].borderTime} 
                className="borderTime"
              />
              <label className="borderTime-printOnly">
                {timeTborder} 
              </label>
          </td>

        </tr>
        </tbody>

        /* <tr>
          

         
            
          
          </tr> */
      )
    })
  )
}
export default TripRowInput