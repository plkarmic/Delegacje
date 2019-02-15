// src/components/CatInputs.js
import React from "react"
import './AdditionalExpansesRowInput.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const AdditionalExpansesRowInput = (props) => {
  return (
    
    props.expansesDetails.map((val, idx)=> {

      let remarkId = `remark-${idx}`, costVId = `costV-${idx}`, costPLNId = `costPLN-${idx}`, remarkCountryId = `remarkCountry-${idx}`
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
          <td htmlFor={remarkCountryId}>
            <input
              type="text"
              name={remarkCountryId}
              data-id={idx}
              id={remarkCountryId}
              value={props.expansesDetails[idx].remarkCountry} 
              className="remarkCountry"
            />
            <label className="remarkCountry-print-only">
              {props.expansesDetails[idx].remarkCountry} 
            </label>
          </td>
          <td htmlFor={costVId}>
            <div className="row no-padding-margin">
              <div className="col-xs-8 col-md-8 no-padding-right">
                <input
                  type="number"
                  name={costVId}
                  data-id={idx}
                  id={costVId}
                  value={props.expansesDetails[idx].costV} 
                  className="costV"
                />
              </div>
              <div className="col-xs-4 col-md-4 expCurrency"> {props.expansesDetails[idx].costVCurrency} </div>
            <label className="costV-print-only">
              {props.expansesDetails[idx].costV} {props.expansesDetails[idx].costVCurrency}
            </label>
            </div>
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