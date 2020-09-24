// Contributor(s): Esa Mäkipää, Taika Tulonen
//
// Esa Mäkipää: 
// Basic code for creating the view. I have used learnings from 
// Full stack open 2020 course by University of Helsinki
//
// Taika Tulonen:
// Implementation of Material-UI related components for building UI
//
// Description: View for showing a single book with information and
// for writing and sending a review. Creates the user interface to 
// write a review text and submit it 

import React, { useState } from "react";
import Book from "./Book";
import NoImage from "../noImage.png";
import bookService from "../services/data";
//import NoImage from "../logo.svg";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// Router
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom"
import {Img} from 'react-image';
// tekstikenttien näyttäminen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi arvostelun lähettämiseen
import Button from '@material-ui/core/Button';
// tähtien antaminen
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
    height: 200,
    width: 120,
    backgroundColor: "#E5E5E5",
    padding: theme.spacing(2),
  },
  // sovelluksen otsikko
  appHeader: {
    flexGrow: 1,
    width: "80ch"
    //bacgroundCOlor: "#E5E5E5"
  },
  // tekstikenttä nimimerkille
  inputTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // tekstikenttä arvostelun kirjoittamiseen
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

const ReviewPage = ( props ) => {

  // kirja id
  const id = useParams().id
  // nimimerkki
  const [ writer, setWriter ] = useState("");
  // arvosteluteksti
  const [ reviewText, setReviewText ] = useState("");
  // kirjan arvostelut
  const [ reviewsToShow, setReviewsToShow ] = useState([]);
  // arvostelu tähdillä
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(-1);

  const classes = useStyles();

  // haetaan kirjan arvostelut (parametrina kirjan id)
  bookService
    .getReviews(id)
    .then(returnedReviews => {
      setReviewsToShow(returnedReviews)
    });

  // lisää kirja ja/tai arvostelu
  const addBook = (event) => {
    event.preventDefault()
    
    const bookObject = {
      book_id: id,
      writer: writer,
      reviewtext: reviewText,
      stars: stars
    }

    setWriter("")
    setReviewText("")
    setStars(0)
      
    // lisää kirjan ja arvostelun tiedot (book object)
    bookService
      .create(bookObject)
      .then(returnedBook => {
        setReviewsToShow(returnedBook.reviews)
      })
    //.catch(error => {
    //  console.log(error.response.data)   
    //})
  }       
    
  // writer input
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  }
    
  // review input
  const handleReviewChange = (event) => {
    setReviewText(event.target.value)
  }
    
  // stars input
  const handleStarsChange = (event) => {
    setStars(event.target.value)
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {props.books.filter(book => book.id === id).map(filteredBook => (
              <Grid key={filteredBook.id} item>
                <Paper className={classes.paper}>
                  <Img  
                    src={!("imageLinks" in filteredBook.volumeInfo) ?  `${NoImage}` : `${filteredBook.volumeInfo.imageLinks.smallThumbnail}`}
                    alt="Book" width="120px" height="180px"
                  />
                  </Paper>
                <div>
                  <Book
                    title={filteredBook.volumeInfo.title}
                    authors={filteredBook.volumeInfo.authors}
                  />
                </div>

                <div>
                  {filteredBook.volumeInfo.description}                
                </div>
              </Grid>
            ))}
          </Grid>  
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <div>
          <br />
            <Typography variant="h6" color="inherit">
              Kirjoita arvostelu
            </Typography>
        </div>  
      </Grid>    

      <Grid container spacing={2}>  
        <div>
          <FormGroup>
            <span>&nbsp;</span>
            <TextField id="writer" value={writer} variant="outlined"  size="small" onChange={handleWriterChange} label="Nimimerkki"/>
            <span>&nbsp;</span>
          </FormGroup>
        </div>
        <div style={{width: "100%"}}>
          <FormGroup>
            <TextField id="review" value={reviewText} variant="outlined" multiline size="small" rowsMax="4" fullWidth onChange={handleReviewChange} label="Kirjoita arvostelu"/>
            <span>&nbsp;</span>

            <div className={classes.rating}>
              <Rating
                name="hover-feedback"
                value={stars}
                precision={0.5}
                onChange={(event, newValue) => {
                  setStars(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
              <div>
                {stars !== null && <Box ml={2} p={0}>{labels[hover !== -1 ? hover : stars]}</Box>}
              </div>
            </div>
          </FormGroup>
          <div>
          {(writer && reviewText && stars) ? <Button variant="contained" id={"addButton"} onClick={addBook}> Lähetä</Button> : <Button variant="contained" id={"addButton"} disabled onClick={addBook}> Lähetä</Button>}   
          </div>
        </div>
      </Grid>

      <Grid container spacing={0}>
        <div>
          <br />
            <Typography variant="h6" color="inherit">
              Kirjan arvostelut
            </Typography>
        </div>  
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {reviewsToShow ? reviewsToShow.map((review) => (
              <div key={review._id}>
                <Box component="fieldset" mb={-3} borderColor="transparent">
                  <Rating name="read-only" value={review.stars} precision={0.5} readOnly /> {review.date}
                </Box>
                <p>"{review.reviewtext}" - {review.writer}</p>
              </div>
            )) : ["Teokselle ei löydy arvosteluja"]}
          </Grid>
        </Grid>
      </Grid>
    </div>      
  )
}

export default ReviewPage;
