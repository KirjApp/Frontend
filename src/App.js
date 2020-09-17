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
  },
  // Material-UI input component Text Field added
  filterTextField: {
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

  const classes = useStyles();

  // get data from server
  useEffect(() => {
    bookService.getAll(newFilter).then((books) => {
      // set data
      setSelectedBooks(books);
    });
  }, [newFilter]);

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

        <h3>Suosituimmat kirjat</h3>

      </Grid>
    </Container>
  );
};

export default App;
