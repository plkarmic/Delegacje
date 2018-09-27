// src/components/CatInputs.js
import React from "react"
import './AdditionalExpansesRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const AdditionalExpansesRowInput = (props) => {
  return (
    
    props.expansesDetails.map((val, idx)=> {

      let remarkId = `remark-${idx}`, costVId = `costV-${idx}`, costPLNId = `costPLN-${idx}`
      if (props.expansesDetails[idx].costV !=="" ) {
        document.getElementById(costPLNId).readOnly = true;
      }
      else if (props.expansesDetails[idx].costPLN !=="" && props.expansesDetails[idx].costV ==="")
      {
        document.getElementById(costVId).readOnly = true;
        document.getElementById(costPLNId).readOnly = false;
      } else if (props.expansesDetails[idx].costPLN === "" && props.expansesDetails[idx].costV === "" && document.getElementById(costVId))
      {
        document.getElementById(costVId).readOnly = false;

      }
      

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
            <label className="remark-print-only">
              {props.expansesDetails[idx].remark} 
            </label>
          </td>
          <td htmlFor={costVId}>
            <input
              type="number"
              name={costVId}
              data-id={idx}
              id={costVId}
              value={props.expansesDetails[idx].costV} 
              className="costV"
            />
            <label className="costV-print-only">
              {props.expansesDetails[idx].costV} 
            </label>
          </td>
          <td htmlFor={costPLNId}>
            <input
              type="number"
              name={costPLNId}
              data-id={idx}
              id={costPLNId}
              value={props.expansesDetails[idx].costPLN} 
              className="costPLN"
            />
            <label className="costPLN-print-only">
              {props.expansesDetails[idx].costPLN} 
            </label>
          </td>
        </tr>
      )
    })
  )
}
export default AdditionalExpansesRowInput