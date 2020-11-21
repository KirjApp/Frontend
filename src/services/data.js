// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Promisejen peruskoodi (promise edustaa asynkronisen operaation onnistumista tai 
// epäonnistumista). Olen hyödyntänyt Full stack open 2020 -kurssin (Helsingin yliopisto) materiaalia
// Lähde: 
// Full stack open 2020 (https://fullstackopen.com/),
// Syväsukellus moderniin websovelluskehitykseen (osat 0-8),
// kurssimateriaali on lisensoitu Creative Commons BY-NC-SA 3.0 -lisenssillä
// https://creativecommons.org/licenses/by-nc-sa/3.0/
//
// Kuvaus: Promiset kirjadatan hakuun, kirjan ja/tai arvostelun tallentamiseen,
// kirjaan liittyvien arvostelujen hakuun, käyttäjän luontiin ja käyttäjän kirjautumiseen.
// Axios-kirjastoa käytetään selaimen ja palvelimen väliseen kommunikointiin
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-license.

import axios from 'axios'

// kirjatiedot Google Books APIsta (hakusana)
const baseUrl = 'http://localhost:3001/api/books'
// kirjatiedot Google Books APIsta (hakusana)
const oneBookBaseUrl = 'http://localhost:3001/api/book'
// kirjan ja/tai arvostelujen käsittely (MongoDB)
const myBaseUrl = 'http://localhost:3001/api/myBooks'
// kirjautuneen käyttäjän kirjoittamat arvostelut
const myReviewsBaseUrl = 'http://localhost:3001/api/userReviews'
// käyttäjän profiilin luonti
const createUserBaseUrl = 'http://localhost:3001/api/users'
// käyttäjän kirjutuminen
const loginBaseUrl = 'http://localhost:3001/api/login'
/*
// relatiiviset osoitteet
const baseUrl = '/api/books'
const oneBookBaseUrl = '/api/book'
const myBaseUrl = '/api/myBooks'
const myReviewsBaseUrl = '/api/userReviews'
const createUserBaseUrl = '/api/users'
const loginBaseUrl = '/api/login'
*/

let token = null

// tokenin asettaminen
const setToken = newToken => {
  token = `bearer ${newToken}`
}

// kirjojen haku Google Books APIsta
const getAll = newFilter => {
  const request = axios.get(baseUrl, {
    params: {
        q: `${newFilter}`,
        maxResults: 12,
        projection: 'full'
    }
  })
  return request.then(response => response.data.data.items)
}

// yhden kirjan haku tietokannasta kirjan id:n avulla (MongoDB)
const getOne = id => {
  const request = axios.get(oneBookBaseUrl + '/' + id, {
    params: {
      projection: 'full'
    }  
  })
  return request.then(response => response.data.data)
}

// kirjan ja/tai arvostelujen tallentaminen tietokantaan (MongoDB)
const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(myBaseUrl, newObject, config)
  return request.then(response => response.data)
}

// kirjan kaikkien arvostelujen haku tietokannasta (MongoDB)
const getReviews = id => {
  const request = axios.get(myBaseUrl + '/' + id)
  return request.then(response => response.data)
}

// kirjan arvostelujen haku tietokannasta kirjautuneelle käyttäjälle (MongoDB)
const getUserReviews = (loggedUser) => {
  setToken(loggedUser.token)
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(myReviewsBaseUrl, config)
  return request.then(response => response.data)
}

// käyttäjän luonti ja tallennus tietokantaan (MongoDB)
const createUser = async newUserObject => {
  const response = await axios.post(createUserBaseUrl, newUserObject)
  return response.data
}

// käyttäjän kirjautuminen
const loginUser = async credentials => {
  const response = await axios.post(loginBaseUrl, credentials)
  return response.data
}

export default {
  getAll,
  getOne,
  create,
  getReviews,
  getUserReviews,
  createUser,
  loginUser,
  setToken
}