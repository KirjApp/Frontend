// Contributor(s): Esa Mäkipää, Juho Hyödynmaa
//
// Esa Mäkipää: 
// Näkymän luonnin perusrunko. Olen hyödyntänyt Full stack open 2020 -kurssilla
// (Helsingin yliopisto) oppimiani asioita
// Lähde:
// Full stack open 2020 (https://fullstackopen.com/),
// Syväsukellus moderniin websovelluskehitykseen (osat 0-8),
// kurssimateriaali on lisensoitu Creative Commons BY-NC-SA 3.0 -lisenssillä
// https://creativecommons.org/licenses/by-nc-sa/3.0/
//
// Juho Hyödynmaa: 
// Päivämäärän muodon määrittely
//
// Kuvaus: Näkymässä näytetään kirjautuneen käyttäjän tiedot (nimimerkki)
// ja painonappi käyttäjän kirjoittamien arvostelujen näyttämiseen
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-license. 

import React, { useState, useEffect } from "react";
// promiset
import { getUserReviews, setToken } from "../services/data";
// tyylit
import { makeStyles } from "@material-ui/core/styles";
// grid
import Grid from "@material-ui/core/Grid";
// tekstityylit
import Typography from '@material-ui/core/Typography';
// painonappi
import Button from '@material-ui/core/Button';
// tähtien antaminen
import Rating from '@material-ui/lab/Rating'; //vaatinee asennuksen: npm install @material-ui/lab
// arvostelujen erottamiseen toisistaan
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  // kirjakortti (Paper Material-UI -komponentti)
  root: {
    flexGrow: 1,
  },
  inputRating: {
    width: 200,
    height: 50,
    display: 'flex',
    alignItems: 'center',
  },
  // tähtikenttä tähtien näyttämiseen
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

const UserPage = () => {

  // nimimerkki
  const [ writer, setWriter ] = useState(JSON.parse(window.localStorage.getItem("loggedUser")));
  // kirjan arvostelut
  const [ userReviewsToShow, setUserReviewsToShow ] = useState([]);
  // tila NÄYTÄ/PIILOTA ARVOSTELUNI -painonapille
  const [ userReviewsShown, setUserReviewsShown ] = useState(false)

  const classes = useStyles();

  useEffect(() => { 
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setWriter(user)
      setToken(user.token)
    }
  }, [])

  // Contributor: Juho Hyödynmaa
  // muokataan Date haluttuun muotoon, tulee funktioon muodossa
  // 2020-10-01T12:28:52.033Z (String)
  const modifyDate = (date) => {
	  return date.substr(11,5) + " GMT - " + date.substr(8,2) + '.' + date.substr(5,2) + '.' + date.substr(0,4)
  }

  // näytetään käyttäjän arvostelut asettamalla
  // setUserReviewsShown arvoksi true. Haetaan arvostelut
  // kirjautuneelle käyttäjälle 
  const handleShowUserReviews = async (event) => {
    //event.preventDefault()
    setUserReviewsShown(true)
    const userReviews = await getUserReviews(writer)

    userReviews.forEach(review => {
      review.date = modifyDate(review.date)
    })

    // virhekäsittely!
    setUserReviewsToShow(userReviews) 
  }
  
  // piilotetaan käyttäjän arvostelut näkyvistä asettamalla
  // setUserReviewsShown arvoksi false
  const handleHideUserReviews = (event) => {
    //event.preventDefault()
    setUserReviewsShown(false)
    setUserReviewsToShow([])
  }

  return (
    <div>
      <Typography variant="body1">
        Nimimerkki: {writer.username}
      </Typography>
      <div>
        <br />
        {userReviewsShown ? <Button variant="contained" id={"hideReviewsButton"} onClick={handleHideUserReviews}> Piilota arvosteluni</Button> : <Button variant="contained" id={"showReviewsButton"} onClick={handleShowUserReviews}> Näytä arvosteluni</Button>}   
      </div>
      
      <Grid container spacing={0}>
        <div>
          <br />
          <Typography variant="h6" color="inherit">
            {userReviewsShown ? "Kirjoittamani arvostelut: " : ""}
          </Typography>
          <br />
        </div>  
      </Grid>
      
      {userReviewsToShow ? userReviewsToShow.map((review) => (        
        <div key={review._id}>
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={0}>
                <Grid item xs={12}>
                  <Typography variant="caption">
                    {review.book_title ? review.book_title : ""}
                  </Typography>
                </Grid>
              </Grid>
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
      )) : <div><Typography variant="body1">
          {userReviewsShown ? "Et ole vielä kirjoittanut arvosteluja" : ""}
        </Typography></div>}
    </div>     
  )
}

export default UserPage;
