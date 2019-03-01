import React from "react"
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

export class DisplayExchangeRateInfo extends React.Component {

    constructor(props)
    {
        super(props);
        this.getCurrency = this.getCurrency.bind(this);
    };  

    // make currency list unique
    getCurrency() { 
        let uniqCurrency = [];
        let uniqCurrencyRate = [];
        for(var i = 0;i < this.props.expansesDetails.length; i++){
            if(this.props.expansesDetails[i].costVCurrency !== 'PLN' & this.props.expansesDetails[i].costVCurrency !== '')
            {
                if(!uniqCurrency.includes(this.props.expansesDetails[i].costVCurrency)){
                    uniqCurrency.push(this.props.expansesDetails[i].costVCurrency);
                    uniqCurrencyRate.push(this.props.expansesDetails[i].costVCurrencyRate);
                }
            }
        }
        return {
            uCurrency: uniqCurrency,
            uCurrencyRate: uniqCurrencyRate
        }
    }

    render () {
        let uniqCurrency = this.getCurrency()
        if (uniqCurrency.uCurrency.length != 0)
        {
            return (
                uniqCurrency.uCurrency.map((val, idx)=> {
    
                    return (
                        <div className="row"> 
                            <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {uniqCurrency.uCurrency[idx]} według Tablea nr {this.props.NBPtableNR} z dnia {this.props.NBPtableDate}: {uniqCurrency.uCurrencyRate[idx]}</label></span></div>
                        </div>
                    )
                    }
    
                )
            )
        }
        else 
        {
            return (
                <div className="row"> 
                    <div className="col-xs-12 col-md-12"><span className="pull-right"><label>Kurs {this.props.NBPCurrency} według Tablea nr {this.props.NBPtableNR} z dnia {this.props.NBPtableDate}: {this.props.NBPCurrencyRate}</label></span></div>
                </div>
            )
        }
    }   
}
