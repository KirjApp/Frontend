// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Basic code for promises (promise represents the eventual completion or 
// failure of an asynchronous operation). I have used learnings from 
// Full stak open 2020 course by University of Helsinki
//
// Description: Promises for getting book data, saving book and/or review data.
// and getting reviews related to selected book.
// Axios library is used for communication between browser and server

import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/books'
const myBaseUrl = 'http://localhost:3001/api/myBooks'
const myReviewsBaseUrl = 'http://localhost:3001/api/userReviews'
const createUserBaseUrl = 'http://localhost:3001/api/users'
const loginBaseUrl = 'http://localhost:3001/api/login'
//const baseUrl = '/api/books'
//const myBaseUrl = '/api/myBooks'

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

const createUser = async newUserObject => {
  const response = await axios.post(createUserBaseUrl, newUserObject)
  return response.data
}

const loginUser = async credentials => {
  const response = await axios.post(loginBaseUrl, credentials)
  return response.data
}

export default { getAll, create, getReviews, getUserReviews, createUser, loginUser, setToken }