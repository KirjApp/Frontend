import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Book from "./components/Book";
import bookService from "./services/data";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";


const useStyles = makeStyles((theme) => ({
	
    paper: {
      height: 250,
      width: 120,
		
	},
}));

const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  const classes = useStyles();

  // get data from server
  useEffect(() => {
    bookService.getAll(newFilter).then((initialBooks) => {
      // set initial state data
      setSelectedBooks(initialBooks);
    });
  }, [newFilter]);

  //näytettävät kirjat hakuehdon mukaan
  const booksToShow = selectedBooks;

  // filter input
  const handleFilterChange = (event) => {
    //console.log(books)
    if (event.target.value) {
      setSelectedBooks(
        books.filter((book) =>
          book.volumeInfo.title
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
    } else {
      setNewFilter("");
      setSelectedBooks([]);
    }
    setNewFilter(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <h2>Books</h2>

      <Grid container spacing={2}>
        <Filter
          text="filter shown with "
          value={newFilter}
          onChange={handleFilterChange}
        />
        
<Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {booksToShow.map((book) => (
              <Grid key={book.id} item>
                <Paper className={classes.paper}>
                  
                  <Book
                    id={book.id}
                   title={book.volumeInfo.title}
                   authors={book.volumeInfo.authors} 
                    />
                
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      </Grid>
      </Container>
  );
};

export default App;

//Tämä oli tilanne sovellusta luotaessa
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

//Tämä on puhelinluettelosovelluksessa
/*
return (
    <div>
      <h2>Books</h2>

      <Notification message={message} type={messageType}/>

      <Filter text='filter shown with ' value={newFilter} onChange={handleFilterChange}  />

      <h3>Add a new</h3>
      
      <PersonForm 
        onSubmit={addName}
        nameText='name: '
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberText='number: '
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>

      <>
        {personsToShow.map((person) => 
          <div key={person.id}>
            <Person name={person.name} number={person.number} onClick={() => handleDeletion(person.id)} text='delete' />
          </div>
        )}
      </>      
    </div>
  )
*/

//import React from 'react';
//import logo from './logo.svg';
//import './App.css';
/*

//const [ newName, setNewName ] = useState('')
//const [ newNumber, setNewNumber ] = useState('')
//const [ showAll, setShowAll ] = useState(true)
//const [ message, setMessage ] = useState('')
//const [ messageType, setMessageType ] = useState('')

const testBooks = [
  {
    id: 1,
    title: 'Fundamentals of React',
    authors: 'Kirjoittaja1'
  },
  {
    id: 2,
    title: 'Using props to pass data',
    authors: 'Kirjoittaja2'
  },
  {
    id: 3,
    title: 'State of a component',
    authors: 'Kirjoittaja3'
  }
]
*/

/*
  const booksToShow = showAll
    ? books.filter(book => book.title.toLowerCase().includes(newFilter.toLowerCase()))
    : books
  */

/* 
  // add a new person (name and number) to phonebook
  const addName = (event) => {
    event.preventDefault()

    let newPerson = true
    let personId = 0
    
    // check if person is already added to phonebook
    persons.forEach((person) => {
      if (person.name === newName) {
        newPerson = false
        personId = person.id
      }
    })
  
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    
    if (newPerson) {
      // add data (new name and number)
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data)
          setMessage(error.response.data.error)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 3000) 
        })
        setMessage(`Added ${newName}`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
        }, 3000)      
    } else {
      // person already exists, number to be updated
      
      let choice = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) 

      if(choice) {
        // number change confirmed, number is updated
        const person = persons.find(person => person.name === newName)
        const updatedPerson = { ...person, number: newNumber }
        personService
          .update(personId, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personId ? person : returnedPerson))
          })
          .then(() => { 
            setMessage(`Updated ${nameObject.name}'s number`)
            setMessageType('success')
            setTimeout(() => {
              setMessage(null)
            }, 3000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(error.response.data)
            setMessage(error.response.data.error)
            setMessageType('error')
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          }) 
      }
    }
  }
  */

/*
  // delete selected name and number
  const removeName = (id) => {
    const deletedPerson = persons.find(p => p.id === id)
 
    if (window.confirm(`Delete ${deletedPerson.name} ?`)) { 
      // deletion corfirmed
      
      personService
        .deleteSelected(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage(`Removed information of ${deletedPerson.name}`)
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          console.log(error.response.data)
          setMessage(`Information of ${deletedPerson.name} has already been removed`)
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        }) 
    }   
  }
  */

/*
  // name input
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // number input
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDeletion = (id) => {
    removeName(id)
  }
  */

//if (!(event.target.value === '')) {

/*
console.log('Kirjan id: ' + books.data.items[i].id);
console.log('Kirjan nimi: ' + books.data.items[i].volumeInfo.title);
console.log('Kirjan kirjoittaja(t): ' + books.data.items[i].volumeInfo.authors);
*/

//<img src={book.volumeInfo.imageLinks.smallThumbnail} alt="Book" width="100px" height="170px" />
