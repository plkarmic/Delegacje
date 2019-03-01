import React from "react"
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

const DisplayExchangeRateInfo = (props) => {

    return (
        props.expansesDetails.map((val, idx)=> {

            return (
                <div className="row"> 
                    <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {props.expansesDetails[idx].costVCurrency} według Tablea nr 'NUMER-TABELI' z dnia 'DATA---': {props.expansesDetails[idx].costVCurrencyRate}</label></span></div>
                </div>
            )
            }

        )
    )

}

export default DisplayExchangeRateInfo