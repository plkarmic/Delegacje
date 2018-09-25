import React from "react"
import './Form.css'

const firstPageInput = (props) => {
    return (
        props.zaliczka.map((val, idx)=> {
            let dataId = `data-${idx}`, nrDowId = `nrDow-${idx}`, walutaId = `waluta-${idx}`, kwotaId = `kwota-${idx}`, slownieId = `slownie-${idx}`, pieczecId = `pieczec-${idx}`
            return (
              
                    <tr key={idx}>
                        <td htmlFor={dataId}>
                            <input
                            type="text"
                            name={dataId}
                            data-id={idx}
                            id={dataId}
                            // value={props.zaliczka[idx].data} 
                            className="userNameForm"
                            />
                        </td>
                        <td htmlFor={nrDowId}>
                            <input
                            type="text"
                            name={nrDowId}
                            data-id={idx}
                            id={nrDowId}
                            // value={props.zaliczka[idx].nrDow} 
                            className="userNameForm"
                            />
                        </td>
                        <td htmlFor={walutaId}>
                            <input
                            type="text"
                            name={walutaId}
                            data-id={idx}
                            id={walutaId}
                            // value={props.zaliczka[idx].waluta} 
                            className="userNameForm"
                            />
                        </td>
                        <td htmlFor={kwotaId}>
                            <input
                            type="text"
                            name={kwotaId}
                            data-id={idx}
                            id={kwotaId}
                            // value={props.zaliczka[idx].kwota} 
                            className="userNameForm"
                            />
                        </td>
                        <td htmlFor={slownieId}>
                            <input
                            type="text"
                            name={slownieId}
                            data-id={idx}
                            id={slownieId}
                            // value={props.zaliczka[idx].slownie} 
                            className="userNameForm"
                            />
                        </td>
                        <td htmlFor={pieczecId}>
                            <label
                            type="text"
                            name={pieczecId}
                            data-id={idx}
                            id={pieczecId}
                            className="userNameFormLabel"
                            />
                        </td>
                    </tr>
                
            )
        }
    )
    )}
export default firstPageInput