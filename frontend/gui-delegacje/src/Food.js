import React from 'react';
import './Food.css'
import './css/bootstrap-3.3.7-dist/css/bootstrap.css'

export class Food extends React.Component {
    state = {
        // countries: ""
    }
    constructor(props)
    {
        super(props);
        this.getCounties = this.getCounties.bind(this);
    };  

    componentWillUpdate() {
      
    }
 
    componentWillReceiveProps()
    {
        this.setState({countries: this.props.tripDetails});
    }

    getCounties() {
        let uniqCountries = [];
        let uniqCountriesPositions = [];
        for(var i = 0;i < this.props.tripDetails.length; i++){
            if(!uniqCountries.includes(this.props.tripDetails[i].country)){
                uniqCountries.push(this.props.tripDetails[i].country);
                uniqCountriesPositions.push(i);
            }
        }
        return {
            uCountries: uniqCountries, 
            uCountriesPos: uniqCountriesPositions
        }
    }

    render () {
        let uniqCntr = this.getCounties()
        console.log(uniqCntr)
        return (
            console.log("Food: " + this.props),
            
            // this.props.tripDetails.map((val, idx) => {
            uniqCntr.uCountries.map((val, idx) => {

            let countryId = `country-${idx}`, breakFastId = `breakFast-${idx}`, lunchId = `lunch-${idx}`, dinnerID = `dinner-${idx}`;
    
            return(
                <tr key={idx}>
                    <td htmlFor={countryId}>
                        <input
                        type="text"
                        name={countryId}
                        data-id={uniqCntr.uCountriesPos[idx]}
                        id={countryId}
                        value={uniqCntr.uCountries[idx]}
                        className="food_country"
                        readOnly
                        />
                    </td>
                    <td htmlFor={breakFastId}>
                        <input
                        type="number"
                        name={breakFastId}
                        data-id={uniqCntr.uCountriesPos[idx]}
                        id={breakFastId}
                        className="food_breakfast"
                        />
                    </td>
                    <td htmlFor={lunchId}>
                        <input
                        type="number"
                        name={lunchId}
                        data-id={uniqCntr.uCountriesPos[idx]}
                        id={lunchId}
                        className="food_lunch"
                        />
                    </td>
                    <td htmlFor={dinnerID}>
                        <input
                        type="number"
                        name={dinnerID}
                        data-id={uniqCntr.uCountriesPos[idx]}
                        id={dinnerID}
                        className="food_dinner"
                        />
                    </td>
                </tr>

            )
        })

            
        )
    }
}