// Contributor(s): Esa Mäkipää
//
// Kuvaus: Määrittelee React-komponentin App. Komponentin sisältö renderöidään 
// tiedostossa public/index.html määriteltyyn div-elementtiin (id arvo 'root')

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.render(
  <Router>
    <App />
  </Router>,
document.getElementById('root')
);
