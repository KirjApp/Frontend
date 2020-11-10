// Contributor(s): Esa Mäkipää, Taika Tulonen
//
// Esa Mäkipää: 
// Kirjadatan haun perusrunko. Olen hyödyntänyt Full stack open 2020
// 2020 -kurssilla (Helsingin yliopisto) oppimaani
//
// Taika Tulonen:
// Alustava käyttöliittymän rakennus Material-UI komponenteilla
// kirjadatan näyttämiseksi kortteina
//
// Kuvaus: Sovelluksen pääsivu. Luo käyttöliittymän hakusanan kirjoittamiselle 
// ja hakutulosten näyttämiselle. Sovellus hakee kirjoja hakusanaa kirjoitettaessa 

import React, { useState, useEffect } from "react";
// yksittäisen kirjan sivu
import ReviewPage from "./components/ReviewPage";
// profiilin luonti
import CreateProfilePage from "./components/CreateProfilePage";
// kirjautuminen
import LoginPage from "./components/LoginPage";
// kirjautuneen käyttäjän tiedot
import UserPage from "./components/UserPage";
// promiset
import bookService from "./services/data";
// tyhjä kuva (, jos kirjatiedoissa ei ole kansikuvaa)
import NoImage from "./noImage.png";
// tyyliy
import { makeStyles } from "@material-ui/core/styles";
// grid
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
// tekstikenttä
import TextField from '@material-ui/core/TextField';
// painonappi
import Button from '@material-ui/core/Button';
// kirja-kortti painonapiksi
import ButtonBase from '@material-ui/core/ButtonBase';
// Switch, Route, Link
import { Switch, Route, Link, useRouteMatch } from "react-router-dom"
// sovelluksen otsikko
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// tähtien antamiseen
import Rating from '@material-ui/lab/Rating'; //vaatinee asennuksen: npm install @material-ui/lab
// kirjakortin muodostamiseen
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
  bookCard: {
    height: 250,
    width: 130,
    backgroundColor: "#E5E5E5",
    padding: theme.spacing(0),
    flexWrap: "nowrap",
  },
  media: {
    height: 120,
    width: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  // syötekenttä hakusanalle
  filterTextField: {
    "& > *": {
      margin: theme.spacing(1),
      width: "70ch",
    },
    backgroundColor: "#FFFFFF",
  },
  // kirjakortin painonappi
  button: {
    display: "flex",
    flexWrap: "nowrap",
    minWidth: 130,
    width: "100%",
  },
  // sovelluksen otsikko
  appHeader: {
    flexGrow: 1,
    width: "70ch"
    //bacgroundColor: "#E5E5E5"
  },
  typography: {
    fontSize: 10,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    color: "black"
  },
  link: {
    '& > * + *': {
      marginRight: theme.spacing(2),
      textDecoration: "none",
    }, 
  },
  title: {
    flexGrow: 1,
  },   
}));

const App = () => {
  // varattu suositeltavien/suosituimpien kirjojen käsittelyyn?
  //const [recommendedBooks, setRecommendedBooks] = useState([]);
  // hakusanan tuottamat kirjat
  const [ selectedBooks, setSelectedBooks ] = useState([]);
  // hakusana
  const [ newFilter, setNewFilter ] = useState("");
  // kirjautunut käyttäjä
  const [ loggedUser, setLoggedUser ] = useState(null);
    
  const classes = useStyles();

  // kirjautuneen käyttäjän haku local storagesta
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setLoggedUser(loggedUser)
      bookService.setToken(loggedUser.token)
    }   
  }, [])

  // hakusanaa vastaavien kirjojen haku serveriltä
  useEffect(() => {
    document.title = "KirjApp"
    let mounted = true
    if (newFilter.trim() !== "" && newFilter.trim().length > 0) {
      bookService.getAll(newFilter).then((books) => {
        if (mounted) {
          // asetetaan valitut kirjat
          setSelectedBooks(books);
        }
      });
    }

    return () => mounted = false;

  }, [newFilter]);

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
 
  // tapahtumankäsittelijä uloskirjautumiselle
  const handleUserLogout = (event) => {
    setLoggedUser(null)
    bookService.setToken(null)
    // poistetaan kirjautuneen käyttäjän tieodt local stragesta
    //window.localStorage.removeItem("loggedUser")
    // poistetaan kaikki tallennettu tieto local storagesta 
    window.localStorage.clear() 
  };

  // tapahtumankäsittelijä käyttäjän kirjautumiselle
  const handleUserLogin = (user) => {
    setLoggedUser(user)
    window.localStorage.setItem(
      "loggedUser", JSON.stringify(user)
    )
  };

  // tapahtumankäsittelijä valitulle (klikatulle) kirjalle
  const handleClickedBook = (book) => {
    // tallennetaan valittu kirja local storageen
    window.localStorage.setItem(
      "selectedBook", JSON.stringify(book)
    )
  };

  const padding = {
    padding: 5
  };
  
 // Juho Hyödynmaa
 // näytetään kirjailijat halutussa muodossa
  const splitAuthors = (authors) => {
    return authors.join(', ')
  }

  // klikatun kirjan tiedot (välitetään ReviewPage-komponentille)
  const match = useRouteMatch("/reviews/:id")
  const book = match
    ? selectedBooks.filter(book => book.id === match.params.id).map(selectedBook => {return selectedBook})
    : null

  return (
    <div>
      <Container maxWidth="sm">
        <div className={classes.appHeader}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit" className={classes.title}>
                KirjApp
              </Typography>
              <Typography variant="subtitle2" color="inherit">
                {loggedUser ? `Kirjautunut: ${loggedUser.username}` : ""}
              </Typography>
                {loggedUser ? <Button color="inherit" className={classes.menuButton} onClick={handleUserLogout} title="Kirjaudu ulos" component={Link} to={"/"}>Kirjaudu ulos</Button> : ""}               
            </Toolbar>
          </AppBar>     
        </div>
        
        <Grid
          justify="space-between"
          container 
          spacing={2}
        >
          <Grid item xs={6}>
            <div>
              <Typography  className={classes.link} variant="body1">
                <Link style={padding} to="/">Etusivu</Link>
              </Typography>
              </div>  
          </Grid>
          <Grid item xs={3}>
            <div>
              <Typography  className={classes.link} variant="body1">
                {loggedUser ? "" : <Link style={padding} to="/profile">Luo profiili</Link>}
              </Typography> 
            </div>
          </Grid>
          <Grid item xs={3}>
            <div>
            <Typography  className={classes.link} variant="body1">
                {loggedUser ? <Link style={padding} to="/user">Omat tiedot</Link> : <Link style={padding} to="/login">Kirjaudu sisään</Link>}
              </Typography> 
            </div>
          </Grid>
       </Grid>
      
        <Switch>
          <Route path="/profile">
            <br />
            <CreateProfilePage />
          </Route>
          <Route path="/login">
            <br />
            <LoginPage onLoggedUser={handleUserLogin} />
          </Route>
          <Route path="/user">
            <br />
            <UserPage />
          </Route>
          <Route path="/reviews/:id">
            <br />
            <ReviewPage books={book} onClick={handleClickedBook(book)}/>
          </Route>
          <Route path="/">
            <div>

              <Grid container spacing={2}>
                <div>
                  <br />
                  <form className={classes.filterTextField} noValidate autoComplete="off">
                    <TextField id="searchText" type="search" label="Hae kirjoja" variant="outlined" size="small" onChange={handleFilterChange} />
                  </form>
                </div>
              </Grid>

              <Grid container spacing={0}>
                <div>
                  <br />
                  <Typography variant="subtitle1" color="inherit">
                    Hakutuloksia: {selectedBooks ? selectedBooks.length : 0} 
                  </Typography>
                </div>
              </Grid>

              <Grid container item xs={12}>
                <Grid container spacing={1}>
                  {selectedBooks ? selectedBooks.map((book) => (
                    <Grid key={book.id} item>
                      <div className={classes.button}>

                        <ButtonBase>

                          <CardActionArea component={Link} to={`/reviews/${book.id}`}> 
                            <Card className={classes.bookCard}>
                              <CardMedia
                                className={classes.media}
                                image={!("imageLinks" in book.volumeInfo) ? `${NoImage}` : `${book.volumeInfo.imageLinks.smallThumbnail}`}
                                alt="Book" width="80px" height="100px"                  
                              />
                              <CardContent>
                                {("averageRating" in book.volumeInfo) ? 
                                  <Rating name="read-only" value={book.volumeInfo.averageRating} precision={0.5} readOnly size="small"/> :
                                  <Rating name="read-only" value={0} precision={0.5} readOnly size="small"/>
                                }
                                <Typography className={classes.typography} variant="caption" component="h2">
                                  {book.volumeInfo.title}
                                </Typography>
                                <Typography className={classes.typography} variant="caption" color="textSecondary" component="p">
                                  {book.volumeInfo.authors ? splitAuthors(book.volumeInfo.authors) : ""}
                                </Typography>
                              </CardContent>
                            </Card>
                          </CardActionArea>

                        </ButtonBase>

                      </div>
                    </Grid>
                  )) : []}
                </Grid>
              </Grid>
    
              <Grid container spacing={0}>
                <div>
                  <br />
                  <Typography variant="h6" color="inherit">
                     
                  </Typography>
                </div>
              </Grid>

            </div>
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
