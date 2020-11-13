// Contributor(s): Esa Mäkipää, Juho Hyödynmaa
//
// Esa Mäkipää: 
//
//
// Juho Hyödynmaa:
// Kirjakortin lataus kirjaid:n perusteella, päivämäärän muodon määrittely, kirjailijoiden listaus
//
// Kuvaus: Sovelluksen pääsivu. Luo käyttöliittymän hakusanan kirjoittamiselle 
// ja hakutulosten näyttämiselle. Sovellus hakee kirjoja hakusanaa kirjoitettaessa 

import React, { useState, useEffect } from "react";
// promiset
import bookService from "../services/data";
// KirjApp-logo esim. tulostumaan tyhjä kansikuvan tilalle
import NoImage from "../KirjApp_logo2.svg";
// tyylit
import { makeStyles } from "@material-ui/core/styles";
// grid
import Grid from "@material-ui/core/Grid";
// tekstikenttä
import TextField from '@material-ui/core/TextField';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// Router
import { useParams } from "react-router-dom"
import {Img} from 'react-image';
// tekstikenttien näyttäminen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi arvostelun lähettämiseen
import Button from '@material-ui/core/Button';
// tähtien antaminen
import Rating from '@material-ui/lab/Rating'; //vaatinee asennuksen: npm install @material-ui/lab
// box
import Box from '@material-ui/core/Box';
// ilmoitusten näyttäminen (virheet ja onnistuneet toiminnot)
import Alert from '@material-ui/lab/Alert';
// arvostelujen erottamiseen toisistaan
import Divider from '@material-ui/core/Divider';
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
  root: {
    flexGrow: 1,
  },
  // tähtikenttä tähtien syöttämiseen arvostelun yhteydessä
  inputRating: {
    width: 200,
    height: 50,
    display: 'flex',
    alignItems: 'center',
  },
  // tähtikenttä tähtien näyttämiseen arvostelujen listauksessa
  outputRating: {
    width: 150,
    height: 20,
    display: 'flex',
    alignItems: 'center',
  },
  // viesti arvostelun lisäämisen onnistumisesta tai epäonnistumisesta
  message: {
    width: '70%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  // arvostelujen välinen jakoviiva (viivan väri)
  divider: {
    backgroundColor: "#E5E5E5",
  },
}));

const ReviewPage = ( props ) => {
  // kirja id
  const id = useParams().id

  // kirjautunut käyttäjä
  const [ user, setUser ] = useState(JSON.parse(window.localStorage.getItem("loggedUser")) || null);
  // nimimerkki
  const [ writer, setWriter ] = useState("");
  // arvosteluteksti
  const [ reviewText, setReviewText ] = useState("");
  // kirjan arvostelut
  const [ reviewsToShow, setReviewsToShow ] = useState([]);
  // arvostelu tähdillä
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")
  // tila LÄHETÄ-painonapille
  const [ buttonPressed, setButtonPressed ] = useState(false)
  // valittu kirja
  const [ selectedBook, setSelectedBook ] = useState(props.books);

  const classes = useStyles();
  
  // Esa Mäkipää, Juho Hyödynmaa
  // haetaan kirjan arvostelut (parametrina kirjan id)
  useEffect(() => {
    let mounted = true
    bookService
    .getOne(id)
    .then(returnedBook => {
      if (mounted) {
        setSelectedBook(returnedBook)
      }
      document.title = "KirjApp: " + returnedBook.volumeInfo.title
    });
    bookService
      .getReviews(id)
      .then(returnedReviews => {
        if (mounted) {
          if (returnedReviews) { 
            returnedReviews.forEach(review => {
              review.date = modifyDate(review.date)
            }) 
          }
          setReviewsToShow(returnedReviews)
          if (buttonPressed) {
            setButtonPressed(false)
          }
        } 
      });
      return () => {
        document.title = "KirjApp"
        mounted = false;
      }
  }, [props.books, id, buttonPressed]);
  
  // Juho Hyödynmaa
  // muokataan Date haluttuun muotoon. tulee funktioon muodossa
  // 2020-10-01T12:28:52.033Z (String)
  const modifyDate = (date) => {
      return date.substr(11,5) + " GMT - " + date.substr(8,2) + '.' + date.substr(5,2) + '.' + date.substr(0,4)
  }
  // lisää kirja ja/tai arvostelu
  const addBook = (event) => {
    event.preventDefault()
    
    const bookObject = {
      book_title: selectedBook.volumeInfo.title,
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
      .catch(error => {
        console.log(error)
        setMessage("Arvostelusi tallentamisessa tapahtui virhe")
        setMessageType("error")   
      })
      setMessage("Arvostelusi on tallennettu")
      setMessageType("success")
      // varmistetaan että arvostelu on tallennettu ennenkö buttonPressed aiheuttaa uuden arvostelujen haun
      setTimeout(() => {
        setButtonPressed(true)
      }, 500)
  }       
    
  // asetetaan nimimerkki
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  }
    
  // asetetaan arvostelu
  const handleReviewChange = (event) => {
    setReviewText(event.target.value)
  }
  
  // Contributor: Juho Hyödynmaa
  // näytetään kirjailijat halutussa muodossa
  const splitAuthors = (authors) => {
    return authors.join(', ')
  }
 
  return (
    <div>
      <br /> 
        <Grid key={selectedBook.id} item>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={0} padding={0}>
                <Grid item xs={5}>
                  <Img  
                    src={!("imageLinks" in Object(selectedBook.volumeInfo)) ? `${NoImage}` : `${selectedBook.volumeInfo.imageLinks.smallThumbnail}`}
                    alt="Book" width="170px" height="250px"
                  /> 
                    
                  <div className={classes.outputRating}>
                    {("averageRating" in Object(selectedBook.volumeInfo)) ? 
                      <Rating name="read-only" value={selectedBook.volumeInfo.averageRating} precision={0.5} readOnly size="medium"/> :
                      <Rating name="read-only" value={0} precision={0.5} readOnly size="medium"/>
                    }
                    <Typography variant="subtitle1">
                      {("averageRating" in Object(selectedBook.volumeInfo)) ? 
                        <div>
                          ({selectedBook.volumeInfo.averageRating})
                        </div> :
                        <div> 
                          (0)
                        </div>  
                      }
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="subtitle2">
                    {Object(selectedBook.volumeInfo).title}
                  </Typography>
                  <br />
                  <Typography variant="body2">  
                    Tekijä(t): {Object(selectedBook.volumeInfo).authors ? splitAuthors(selectedBook.volumeInfo.authors) : ""}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    {("description" in Object(selectedBook.volumeInfo)) ? 
                      <div>
                        <TextField id="review" inputProps={{style: {fontSize: 14}}} value={selectedBook.volumeInfo.description} variant="outlined" multiline size="small" rows="8" rowsMax="8" fullWidth label="Kuvaus:"/>
                      </div> :
                      <div> 
                      </div>  
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
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
            {user ? <TextField id="writer" value={writer} variant="outlined" size="small" onChange={handleWriterChange} label="Nimimerkki"/> : <TextField id="writer" value={writer} variant="outlined" size="small" onChange={handleWriterChange} label="Nimimerkki"/>}
          </FormGroup>
        </div>
        <div style={{width: "100%"}}>
          <FormGroup>
            <span>&nbsp;</span>
            <TextField id="review" value={reviewText} variant="outlined" multiline size="small" rowsMax="4" fullWidth onChange={handleReviewChange} label="Kirjoita arvostelu"/>
            <div className={classes.inputRating}>
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
                <Typography variant="caption">
                  {stars !== null && <Box ml={2} p={0}>{labels[hover !== -1 ? hover : stars]}</Box>}
                </Typography>
              </div>
            </div>
          </FormGroup>
          <br />
          <Grid container spacing={1}>
            <Grid container item xs={12} spacing={0} padding={0}>
              <Grid item xs={4}>
                <div>
                  {((user ? user.username : writer) && reviewText && stars) ? <Button variant="contained" id={"addButton"} onClick={addBook}>Lähetä</Button> : <Button variant="contained" id={"addButton"} disabled onClick={addBook}>Lähetä</Button>}   
                </div>
              </Grid>
              <Grid item xs={8}>
                <div className={classes.message}>
                  {message ? <Alert severity={messageType}>{message}</Alert> : null}
                </div>
              </Grid>
            </Grid>
          </Grid> 
        </div>
      </Grid>
      
      <br />
      <Grid container spacing={0}>
        <div>
          <br />
          <Typography variant="h6" color="inherit">
            KirjApp-käyttäjien antamat arvostelut:
          </Typography>
          <br />
        </div>  
      </Grid>
      
      {reviewsToShow ? reviewsToShow.map((review) => (        
        <div key={review._id}>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={0} padding={0}>
                <Grid item xs={2}>
                  <Typography variant="caption">
                    KirjApp tähdet:
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <div className={classes.outputRating}>
                    <Rating name="read-only" value={review.stars} precision={0.5} readOnly size="small"/>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption">
                    {review.date}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item xs={12} spacing={0}>
                <Grid item xs={12}>
                  <Typography variant="caption">
                    "{review.reviewtext}" - {review.writer}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider className={classes.divider} />
        </div>
      )) : <Typography variant="body1">Teokselle ei löydy arvosteluja.</Typography>}     
    </div>     
  )
}
export default ReviewPage;