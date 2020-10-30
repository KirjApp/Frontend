// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Näkymän luonnin perusrunko. Olen hyödyntänyt Full stack open 2020
// 2020 -kurssilla (Helsingin yliopisto) oppimaani
//

import React, { useState, useEffect } from "react";

import bookService from "../services/data";
// KirjApp-logo esim. tulostumaan tyhjä kansikuvan tilalle
import NoImage from "../KirjApp_logo2.svg";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// Router
import { /*BrowserRouter as Router, Switch, Route, Link,*/ useParams } from "react-router-dom"
import {Img} from 'react-image';
// tekstikenttien näyttäminen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi arvostelun lähettämiseen
import Button from '@material-ui/core/Button';
// tähtien antaminen
import Rating from '@material-ui/lab/Rating'; //vaatinee asennuksen: npm install @material-ui/lab
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
// arvostelujen erottamiseen toisistaan
import Divider from '@material-ui/core/Divider';
/*
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
*/
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

  // kirja id
  const id = useParams().id
  // nimimerkki
  const [ writer, setWriter ] = useState(JSON.parse(window.localStorage.getItem("loggedUser")));
  // arvosteluteksti
  const [ reviewText, setReviewText ] = useState("");
  // kirjan arvostelut
  const [ userReviewsToShow, setUserReviewsToShow ] = useState([]);
  // arvostelu tähdillä
  const [stars, setStars] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")
  // tila LÄHETÄ-painonapille
  const [ userReviewsShown, setUserReviewsShown ] = useState(false)

  const classes = useStyles();

  useEffect(() => { 
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setWriter(user)
      bookService.setToken(user.token)
    }
  }, [])

  // Juho Hyödynmaa
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
    const userReviews = await bookService
      .getUserReviews(writer)

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
      )) : <Typography variant="body1">
          {userReviewsShown ? "Et ole vielä kirjoittanut arvosteluja" : ""}
        </Typography>}
    </div>     
  )
}

export default UserPage;
