import React from "react"
import './Form.css'

const firstPageInput = (props) => {
    return (
        props.zaliczka.map((val, idx)=> {
            let kwota = props.zaliczka[idx].kwota
            if (kwota === 0)
            {
                kwota = ""
            }
            let dataId = `data-${idx}`, nrDowId = `nrDow-${idx}`, walutaId = `waluta-${idx}`, kwotaId = `kwota-${idx}`, slownieId = `slownie-${idx}`, pieczecId = `pieczec-${idx}`
            return (
              
                    <tr key={idx}>
                        <td htmlFor={dataId}>
                            <input
                            type="date"
                            name={dataId}
                            data-id={idx}
                            id={dataId}
                            value={props.zaliczka[idx].data} 
                            className="userNameForm data"
                            />
                            <label className="userNameForm data label print-only">
                                {props.zaliczka[idx].data} 
                            </label>
                        </td>
                        <td htmlFor={nrDowId}>
                            <input
                            type="text"
                            name={nrDowId}
                            data-id={idx}
                            id={nrDowId}
                            value={props.zaliczka[idx].nrDow} 
                            className="userNameForm nrDow"
                            />
                            <label className="userNameForm nrDow label print-only">
                                {props.zaliczka[idx].nrDow} 
                            </label>
                        </td>
                        <td htmlFor={walutaId}>
                            <input
                            type="text"
                            name={walutaId}
                            data-id={idx}
                            id={walutaId}
                            value={props.zaliczka[idx].waluta} 
                            className="userNameForm waluta"
                            />
                            <label className="userNameForm waluta label print-only">
                                {props.zaliczka[idx].waluta} 
                            </label>
                        </td>
                        <td htmlFor={kwotaId}>
                            <input
                            type="number"
                            name={kwotaId}
                            data-id={idx}
                            id={kwotaId}
                            value={props.zaliczka[idx].kwota} 
                            className="userNameForm kwota"
                            />
                            <label className="userNameForm kwota label print-only">
                                {kwota} 
                            </label>
                        </td>
                        <td htmlFor={slownieId}>
                            <input
                            type="text"
                            name={slownieId}
                            data-id={idx}
                            id={slownieId}
                            value={props.zaliczka[idx].slownie} 
                            className="userNameForm slownie"
                            />
                            <label className="userNameForm slownie label print-only">
                                {props.zaliczka[idx].slownie} 
                            </label>
                        </td>
                        <td htmlFor={pieczecId}>
                            <label
                            type="text"
                            name={pieczecId}
                            data-id={idx}
                            id={pieczecId}
                            className="userNameFormLabel pieczec"
                            />
                        </td>
                    </tr>
                
            )
        }
    )
    )}
export default firstPageInput