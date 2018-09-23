// src/components/CatInputs.js
import React from "react"
import './AdditionalExpansesRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const AdditionalExpansesRowInput = (props) => {
  return (
    props.expansesDetails.map((val, idx)=> {
      let remarkId = `remark-${idx}`, costVId = `costV-${idx}`, costPLNId = `costPLN-${idx}`
      return (
        <tr key={idx}>
          <td htmlFor={remarkId}>
            <input
              type="text"
              name={remarkId}
              data-id={idx}
              id={remarkId}
              value={props.expansesDetails[idx].remark} 
              className="remark"
            />
          </td>
          <td htmlFor={costVId}>
            <input
              type="text"
              name={costVId}
              data-id={idx}
              id={costVId}
              value={props.expansesDetails[idx].costVId} 
              className="costV"
            />
          </td>
          <td htmlFor={costPLNId}>
            <input
              type="text"
              name={costPLNId}
              data-id={idx}
              id={costPLNId}
              value={props.expansesDetails[idx].costPLN} 
              className="costPLN"
            />
          </td>
        </tr>
      )
    })
  )
}
export default AdditionalExpansesRowInput