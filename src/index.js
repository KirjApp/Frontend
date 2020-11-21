// Contributor(s): Esa Mäkipää
//
// Olen hyödyntänyt Full stack open 2020 -kurssilla (Helsingin yliopisto) oppimiani asioita
// Lähde:
// Full stack open 2020 (https://fullstackopen.com/),
// Syväsukellus moderniin websovelluskehitykseen (osat 0-8),
// kurssimateriaali on lisensoitu Creative Commons BY-NC-SA 3.0 -lisenssillä
// https://creativecommons.org/licenses/by-nc-sa/3.0/ 
//
// Kuvaus: Määrittelee React-komponentin App. Komponentin sisältö renderöidään 
// tiedostossa public/index.html määriteltyyn div-elementtiin (id arvo 'root')
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-licence. 

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
