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
//kirja-kortti painonapiksi kokeilu
import ButtonBase from '@material-ui/core/ButtonBase';
//Router-kokeilua varten
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
//sovelluksen otsikon kokeilu
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
//tekstityylien kokeilu
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 250,
    width: 120,
    // background color added
    backgroundColor: "#E5E5E5",
    // padding added
    padding: theme.spacing(2),
  },
  // Material-UI input component Text Field added
  filterTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  },
  //Lisätty (kirjakortin painonappi-kokeilu)
  button: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 120,
    width: "100%",
  },
  // Lisätty (sovelluksen otsikko)
  appHeader: {
    flexGrow: 1,
    width: "80ch"
    //bacgroundCOlor: "#E5E5E5"
  },
  //Lisätty (book id, writer ja stars -input-kentät)
  inputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    backgroundColor: "#FFFFFF",
  },
  //Lisätty (reveiw text input-kenttä)
  reviewInputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  }, 
}));

const App = () => {
  // recommendedBooks reserved to handle recommended books?
  //const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [ books, setBooks ] = useState([]);
  const [ bookId, setBookId ] = useState(""); 
  const [ writer, setWriter ] = useState("");
  const [ reviewText, setReviewText ] = useState("");
  const [ stars, setStars ] = useState("");

  const classes = useStyles();

  // get data from server
  useEffect(() => {
    bookService.getAll(newFilter).then((books) => {
      // set data
      setSelectedBooks(books);
    });
  }, [newFilter]);

  // REVIEW-näkymä, kirjan ja tai/arvostelun lisääminen (alkaa)
  // add a book and/or review 
  const addBook = (event) => {
    event.preventDefault()

    const bookObject = {
      book_id: bookId,
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
  // REVIEW-näkymä, kirjan ja tai/arvostelun lisääminen (päättyy)

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

  // REVIEW-näkymä, tapahtumankäsittelijät (alkaa)
  // writer input
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
  // REVIEW-näkymä (päättyy)
  return (
    <Container maxWidth="sm">
      
      <div className={classes.appHeader}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              KirjApp
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

      <Grid container spacing={2}>
        <div>
          <span>&nbsp;</span>
            <form className={classes.filterTextField} noValidate autoComplete="off">
              <TextField id="outlined-basic" label="Hae kirjan tai kirjoittajan nimellä" variant="outlined" onChange={handleFilterChange} />
            </form>
        </div>
      </Grid>

      <Grid container spacing={0}>
        <div>
          <span>&nbsp;</span>
            <Typography variant="subtitle1" color="inherit">
              Hakutuloksia: {selectedBooks.length} 
            </Typography>
        </div>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {selectedBooks.map((book) => (
              <Grid key={book.id} item>
                <div className={classes.button}>
                  <ButtonBase>
                    
                    <Paper className={classes.paper}>
                      
                      <Book
                        
                        //kuvan liittäminen kirja-korttiin?
                        //id={book.id}
                    
                        title={book.volumeInfo.title} 
                        authors={book.volumeInfo.authors} 
                      
                      />
                     
                    </Paper>
                  </ButtonBase>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container spacing={0}>
        <div>
          <span>&nbsp;</span>
          <Typography variant="h6" color="inherit">
            Suosituimmat kirjat
          </Typography>
        </div>
      </Grid>
      
      <Grid container spacing={0}>
        <div>
          <span>&nbsp;</span>
          <Typography variant="h6" color="inherit">
            Add a review 
          </Typography>
        </div>  
      </Grid>    

      <Grid container spacing={2}>  
        <div>
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
      </Grid>
    </Container>
  );
};

export default App;
