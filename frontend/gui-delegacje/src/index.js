import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Form from './Form'
import registerServiceWorker from './registerServiceWorker';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';

// ReactDOM.render(<App />, document.getElementById('root'));
if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
{
  alert('Aplikacja działa tylko w przeglądarce Chrome lub Edge');
  
} 
else {
    ReactDOM.render(<Form />, document.getElementById('form'));
}
registerServiceWorker();
