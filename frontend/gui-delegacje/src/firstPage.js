import React from "react"
import './Form.css'
import FirstPageInput from "./FirstPageInput"

const firstPage = (props) => {
    let zaliczka = props.zaliczka
    var date = new Date()
    date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    return (
        <div>
            <div className="row">
                <div className="col-xs-8 col-md-8"> <label forHtml="userNameBU">Wienerberger Ceramika Budowlana</label></div>
                <div className="col-xs-2 col-md-2"> <input type="text" className="userNameForm" name="userNameCity" id="userNameCity" placeholder="Miejscowość"/></div>
                <div className="col-xs-2 col-md-2"> <input type="text" className="userNameFormDate" name="userNameDate" id="userNameDate" value={ date }/></div>
            </div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row text-center">
                <div className="col-xs-12 col-lg-12 text-center">
                    <span className="text-center"><h1 className="text-center">Polecenie Wyjazdu Służbowego / Delegacja Zagraniczna</h1></span>
                </div>
            </div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row">
                <div className="col-xs-2 col-md-2"> <h5><label forHtml="userName">dla Pani/Pana</label></h5> </div>
                <div className="col-xs-4 col-md-4"> <input type="text" className="userNameForm" name="userName" id="userName"/></div>
            </div>
            <div className="row">
                <div className="col-xs-2 col-md-2"> <h5><label forHtml="userNameDo">do</label></h5> </div>
                <div className="col-xs-4 col-md-4"> <input type="text" className="userNameForm" name="userNameDo" id="userNameDo"/></div>
            </div>
            <div className="row">
                <div className="col-xs-2 col-md-2"> <h5><label forHtml="userNameFrom">na czas od</label></h5> </div>
                <div className="col-xs-4 col-md-4"> <input type="text" className="userNameForm" name="userNameFrom" id="userNameFrom"/></div>
                <div className="col-xs-2 col-md-2"> <h5><label forHtml="userNameTo">na czas do</label></h5> </div>
                <div className="col-xs-4 col-md-4"> <input type="text" className="userNameForm" name="userNameTo" id="userNameTo"/></div>
            </div>
            <div className="row">
                <div className="col-xs-2 col-md-2"> <h5><label forHtml="userNameFor">w celu</label></h5> </div>
                <div className="col-xs-4 col-md-4"> <input type="text" className="userNameForm" name="userNameFor" id="userNameFor"/></div>
            </div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row"><br></br></div>
            <div className="row">
                <div className="col-xs-12 col-md-12"> 
                    <table className="table table-bordered table-condensed">
                        <thead>
                            <tr>
                                <th className="text-center"><label>Data</label></th>
                                <th className="text-center"><label>Nr. dowodu</label></th>
                                <th className="text-center"><label>Waluta</label></th>
                                <th className="text-center"><label>Kwota</label></th>
                                <th className="text-center"><label>Słownie</label></th>
                                <th className="text-center"><label>Pieczęć i podpis księgowego, kasjera</label></th>
                            </tr>
                        </thead>
                        <tbody>
                            <FirstPageInput zaliczka={zaliczka}/>
                            <FirstPageInput zaliczka={zaliczka}/>
                            <FirstPageInput zaliczka={zaliczka}/>
                            <FirstPageInput zaliczka={zaliczka}/>
                            <FirstPageInput zaliczka={zaliczka}/>
                            <FirstPageInput zaliczka={zaliczka}/>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row"><br></br></div>
            <div className="row">
                <div className="col-xs-6 col-md-6"> </div>
                <div className="col-xs-4 col-md-4"> <h5><label forHtml="userNameZaliczkaSuma">wypłacona zaliczka (suma)</label></h5> </div>
                <div className="col-xs-2 col-md-2"> <input type="text" className="userNameForm" name="userNameZaliczkaSuma" id="userNameZaliczkaSuma"/></div>
            </div>
            <div className="row"><br></br></div>
            <div className="row">
                <div className="col-xs-6 col-md-6"> </div>
                <div className="col-xs-2 col-md-2"> </div>
                <div className="col-xs-4 col-md-4"> <label className="userNameFormPodpis">Podpis przełożonego </label></div>
            </div>
            <div className="page-break"></div>
        </div>
    )
}
export default firstPage