import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/books'
//const baseUrl = `https://www.googleapis.com/books/v1/volumes`
//?q=${props.newFilter}t&maxResults=20&projection=full
/*
axios.get('https://www.google.com/search', {
    params: {
        q: 'axios'
    }
})
*/


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

/*
const getAll = newFilter => {
  //const request = axios.get(`https://www.googleapis.com/books/v1/volumes?q=${props.newFilter}t&maxResults=20&projection=full`)
  const request = axios.get(baseUrl + `/?query=${newFilter}`)
  return request.then(response => response.data.data.items)
}
*/
/*
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deleteSelected = id => {
  const request = axios.delete(baseUrl + '/' + id)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}
*/
export default { getAll /*, create, deleteSelected, update*/ }