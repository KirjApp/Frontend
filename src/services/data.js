// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Basic code for promises (promise represents the eventual completion or 
// failure of an asynchronous operation). I have used learnings from 
// Full stak open 2020 course by University of Helsinki
//
// Description: Promises for getting book data and saving book and/or review data.
// Axios library is used for communication between browser and server

import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/books'
const myBaseUrl = 'http://localhost:3001/api/myBooks'
//const baseUrl = `https://www.googleapis.com/books/v1/volumes`
//?q=${props.newFilter}t&maxResults=20&projection=full
/*
axios.get('https://www.google.com/search', {
    params: {
        q: 'axios'
    }
})
*/

// kirjojen haku Google Books APIsta
const getAll = newFilter => {
  const request = axios.get(baseUrl, {
    params: {
        q: `${newFilter}`,
        maxResults: 20,
        projection: 'full'
    }
  })
  return request.then(response => response.data.data.items)
}

// kirjan ja/tai arvostelujen tallentaminen tietokantaan (MongoDB)
const create = newObject => {
  const request = axios.post(myBaseUrl, newObject)
  return request.then(response => response.data)
}

// kirjan arvostelujen haku tietokannasta (MongoDB)
const getReviews = id => {
  const request = axios.get(myBaseUrl + '/' + id)
  return request.then(response => response.data)
}

export default { getAll, create, getReviews /*, create, deleteSelected, update*/ }