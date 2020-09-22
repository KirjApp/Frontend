// Contributor(s): Esa Mäkipää, Taika Tulonen
//
// Esa Mäkipää: 
// Basic code for getting data and filtering. I have used learnings from 
// Full stack open 2020 course by University of Helsinki
//
// Taika Tulonen:
// Implementation of Material-UI related components for showing
// books and building UI in general
//
// Description: Main page of the application. Creates the user interface to 
// write search text and show the search results

import React, { useState, useEffect } from "react";
import Book from "./components/Book";
import ReviewPage from "./components/ReviewPage";
import bookService from "./services/data";
import NoImage from "./noImage.png";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';
// kirja-kortti painonapiksi
import ButtonBase from '@material-ui/core/ButtonBase';
// Router
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
// sovelluksen otsikon kokeilu
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// tekstityylit
import Typography from '@material-ui/core/Typography';
import {Img} from 'react-image';

// tekstikenttien näyttämiseen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi arvostelun lähettämiseen
import Button from '@material-ui/core/Button';
// tähtien antamiseen
import Rating from '@material-ui/lab/Rating'; //vaatinee asennuksen: npm install @material-ui/lab
import Box from '@material-ui/core/Box';

// tähtien arvoa vastaavat sanalliset kuvaukset 
const labels = {
  0.5: 'Hyödytön',
  1: 'Hyödytön+',
  1.5: 'Huono',
  2: 'Huono+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Hyvä',
  4: 'Hyvä+',
  4.5: 'Erinomainen',
  5: 'Erinomainen+',
};

const useStyles = makeStyles((theme) => ({
  // kirjakortti (Paper Material-UI -komponentti)
  paper: {
    height: 250,
    width: 120,
    backgroundColor: "#E5E5E5",
    padding: theme.spacing(2),
  },
  // syötekenttä hakusanalle
  filterTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // kirjakortin painonappi
  button: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 120,
    width: "100%",
  },
  // sovelluksen otsikko
  appHeader: {
    flexGrow: 1,
    width: "80ch"
    //bacgroundColor: "#E5E5E5"
  },
  // tekstikenttä kirjan id:lle, nimimerkille ja tähdille
  inputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // tekstikenttä arvostelutekstille
  reviewInputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // tähtikenttä
  rating: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  }, 
}));

const App = () => {
  // varattu suositeltavien/suosituimpien kirjojen käsittelyyn?
  //const [recommendedBooks, setRecommendedBooks] = useState([]);
  // hakusanan tuottamt kirjat
  const [selectedBooks, setSelectedBooks] = useState([]);
  // hakusana
  const [newFilter, setNewFilter] = useState("");
  const [ books, setBooks ] = useState([]);
  const [ bookId, setBookId ] = useState("");
  // nimimerkki 
  const [ writer, setWriter ] = useState("");
  // arvosteluteksti
  const [ reviewText, setReviewText ] = useState("");
  // arvostelu tähdillä
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  
  const classes = useStyles();

  // hakusanaa vastaavien kirjojen haku serveriltä
  useEffect(() => {
    let mounted = true
    if (newFilter.trim() !== "" && newFilter.trim().length > 0) {
    bookService.getAll(newFilter).then((books) => {
      if (mounted) {
        // set data
        setSelectedBooks(books);
      }
    });
  } 

  return () => mounted = false;

  }, [newFilter]);

  // REVIEW-näkymä, kirjan ja tai/arvostelun lisääminen (alkaa)
 
  const addBook = (event) => {
    event.preventDefault()

    const bookObject = {
      book_id: bookId,
      writer: writer,
      reviewtext: reviewText,
      stars: stars
    }

    // tekstikenttien tyhjentäminen arvostelun lähettämisen jälkeen
    setBookId("")
    setWriter("")
    setReviewText("")
    setStars(0)

    //useEffect(() => {
    bookService
      .create(bookObject)
      .then(returnedBook => {
        setBooks(books.concat(returnedBook))
        //setBookId("")
        //setWriter("")
        //setReviewText("")
        //setStars("")
      })
      .catch(error => {
        console.log(error.response.data)   
      }); 
  }
  // REVIEW-näkymä, kirjan ja tai/arvostelun lisääminen (päättyy)

  // tapahtumankäsittelijä hakusanalle
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
  // kirjan id
  const handleBookIdChange = (event) => {
    setBookId(event.target.value)
  };
  // nimimerkki
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  };

  // arvosteluteksti
  const handleReviewChange = (event) => {
    setReviewText(event.target.value)
  };

  // tähdet
  const handleStarsChange = (event) => {
    setStars(event.target.value)
  };
  // REVIEW-näkymä (päättyy)

  const padding = {
    padding: 5
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">Etusivu</Link>
        <Link style={padding} to="/reviews">Kirjanäkymä</Link>
      </div>

      <Switch>
        <Route path="/reviews/:id">
          <ReviewPage books={selectedBooks} />
        </Route>
        <Route path="/reviews/">
          <ReviewPage books={selectedBooks} />
        </Route>
      </Switch>


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
              <TextField id="searchText" label="Hae kirjoja" variant="outlined" size="small" onChange={handleFilterChange} />
            </form>
        </div>
      </Grid>

      <Grid container spacing={0}>
        <div>
          <span>&nbsp;</span>
            <Typography variant="subtitle1" color="inherit">
            Hakutuloksia: {selectedBooks ? selectedBooks.length : 0} 
            </Typography>
        </div>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {selectedBooks ? selectedBooks.map((book) => (
              <Grid key={book.id} item>
                <div className={classes.button}>
                  <ButtonBase>                   
                    <Paper className={classes.paper}>
                      
                      <Img
                        //src={[`${NoImage}`]}
                        src={!("imageLinks" in book.volumeInfo) ?  `${NoImage}` : `${book.volumeInfo.imageLinks.smallThumbnail}`}
                        //src={[`${book.volumeInfo.imageLinks.smallThumbnail}`, `${NoImage}`]}
                        alt="Book" width="100px" height="140px"
                      />

                      <Link to={`/reviews/${book.id}`}>{book.volumeInfo.title}</Link>
                      
                      <Book
                        //id={book.id}
                        //title={book.volumeInfo.title} 
                        authors={book.volumeInfo.authors}                       
                      />
                     
                    </Paper>
                  </ButtonBase>
                </div>
              </Grid>
            )) : []}
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


            
    </Container>
    </Router>
  );
};

export default App;
