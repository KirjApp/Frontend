import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


ReactDOM.render(
  <App />,
document.getElementById('root')
);







/*
axios.get('http://localhost:3001/books').then(response => {
  const books = response.data
  ReactDOM.render(
    <App books={books} />,
    document.getElementById('root')
  )
})
*/
/*
const App = () => {
  console.log('Hello from komponentti')
  return (
  <div>
    <p>Hello world</p>
  </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
*/
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
/*
serviceWorker.unregister();
*/

//import './index.css';
//import axios from 'axios'
//import * as serviceWorker from './serviceWorker';