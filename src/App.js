// Contributor(s): Esa Mäkipää, Taika Tulonen
//
// Esa Mäkipää: 
// Basic code for getting data and filtering. I have used learnings from 
// Full stak open 2020 course by University of Helsinki
//
// Taika Tulonen:
// Implementation of Material-UI related components for showing
// books
//
// Description: Main page of the application. Creates the user interface to 
// write search text and show the search results

import React, { useState, useEffect } from "react";
import Book from "./components/Book";
import bookService from "./services/data";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  
  paper: {
    height: 250,
    width: 120,
		// background color added
    backgroundColor: "#E5E5E5",
    // padding added
    padding: theme.spacing(2),
  },
  // Material-UI input component Text Field added (search field)
  filterTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // added book id, writer and stars -input fields)
  // FOR TESTING PURPOSES PNLY AT THIS PHASE
  inputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // added reveiw text input field)
  // FOR TESTING PURPOSES PNLY AT THIS PHASE
  reviewInputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  },  
}));

const App = () => {
  // recommendedBooks reserved to handle recommended books
  //const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  // for testing to write and submit a review (begins)
  const [ books, setBooks ] = useState([]);
  const [ book_id, setBookId ] = useState(""); 
  const [ writer, setWriter ] = useState("");
  const [ reviewText, setReviewText ] = useState("");
  const [ stars, setStars ] = useState("");
  // for testing to write and submit a review (ends)

  const classes = useStyles();

  // get data from server
  useEffect(() => {
    bookService.getAll(newFilter).then((books) => {
      // set data
      setSelectedBooks(books);
    });
  }, [newFilter]);

  // FOR REVIEW TESTING, to add a book and/or review (begins)
  // add a book and/or review 
  const addBook = (event) => {
    event.preventDefault()

    const bookObject = {
      book_id: book_id,
      writer: writer,
      reviewtext: reviewText,
      stars: stars
    }
  
    //useEffect(() => {
    bookService
      .create(bookObject)
      .then(returnedBook => {
        setBooks(books.concat(returnedBook))
        setBookId("")
        setWriter("")
        setReviewText("")
        setStars("")
      })
      .catch(error => {
        console.log(error.response.data)   
      }); 
  }
  // FOR REVIEW TESTING, to add a book and/or review (ends)

  // filter input
  const handleFilterChange = (event) => {
    if (event.target.value) {
      setSelectedBooks(
        selectedBooks.filter((book) =>
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

  // FOR REVIEW TESTING, event handlers (begins)
  // book id input
  const handleBookIdChange = (event) => {
    setBookId(event.target.value)
  };
  // writer input
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  };

  // review input
  const handleReviewChange = (event) => {
    setReviewText(event.target.value)
  };

  // stars input
  const handleStarsChange = (event) => {
    setStars(event.target.value)
  };
  // FOR REVIEW TESTING, event handlers (ends)
  // the code under title "Add a Review" is for testing
  // writing and submitting a review

  return (
    <Container maxWidth="sm">
      <h2>Books</h2>

      <Grid container spacing={2}>
        
        <form className={classes.filterTextField} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Hae kirjan tai kirjoittajan nimellä" variant="outlined" onChange={handleFilterChange} />
        </form>

        <div>
          Hakutuloksia: {selectedBooks.length}
        </div>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {selectedBooks.map((book) => (
                <Grid key={book.id} item>
                  <Paper className={classes.paper}>
                  
                    <Book
                      //id={book.id}
                      title={book.volumeInfo.title}
                      authors={book.volumeInfo.authors} 
                    />
                
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <h3>Suosituimmat kirjat</h3>

      </Grid>
      <div>
        <span>&nbsp;</span>
        <h3>Add a Review</h3>
    
        <form onSubmit={addBook}>
          <form className={classes.inputTextField} noValidate autoComplete="off">
            <TextField id="outlined-basic" label="Book id" variant="outlined" onChange={handleBookIdChange} />
          </form>
          <form className={classes.inputTextField} noValidate autoComplete="off">
            <TextField id="outlined-basic" label="Writer" variant="outlined" onChange={handleWriterChange} />
          </form>
          <form className={classes.reviewInputTextField} noValidate autoComplete="off">
            <TextField id="outlined-basic" label="Review text" variant="outlined" onChange={handleReviewChange} />
          </form>
          <form className={classes.inputTextField} noValidate autoComplete="off">
            <TextField id="outlined-basic" label="Stars" variant="outlined" onChange={handleStarsChange} />
          </form>
          <button type="submit">add review</button>
        </form>
      </div>
    </Container>
  );
};

export default App;
