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
// yksittäisen kirjan sivu
import ReviewPage from "./components/ReviewPage";
import bookService from "./services/data";
// tyhjä kuva (, jos kirjatiedoissa ei ole kansikuvaa)
import NoImage from "./noImage.png";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import TextField from '@material-ui/core/TextField';
// kirja-kortti painonapiksi
import ButtonBase from '@material-ui/core/ButtonBase';
// Router
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
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
    width: 120,
    backgroundColor: "#E5E5E5",
    padding: theme.spacing(2),
  },
  media: {
    height: 120,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
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
}));

const App = () => {
  // varattu suositeltavien/suosituimpien kirjojen käsittelyyn?
  //const [recommendedBooks, setRecommendedBooks] = useState([]);
  // hakusanan tuottamat kirjat
  const [selectedBooks, setSelectedBooks] = useState([]);
  // hakusana
  const [newFilter, setNewFilter] = useState("");
    
  const classes = useStyles();

  // hakusanaa vastaavien kirjojen haku serveriltä
  useEffect(() => {
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

  const padding = {
    padding: 5
  };

  //const match = useRouteMatch("/reviews/:id")
  //const book = match 
  //  ? selectedBooks.find(book => book.id === match.params.id)
  //  : null

  return (
    <div>
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
      
        <Switch>
          <Route path="/reviews/:id">
            <div>
              <Typography variant="body1">
                <Link style={padding} to="/">Etusivu</Link>
              </Typography>  
            </div>
            <br />
            <ReviewPage books={selectedBooks} />
          </Route>
          <Route path="/reviews/">
            <ReviewPage books={selectedBooks} />
          </Route>
          <Route path="/">
            <div>

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

                            <CardActionArea component={Link} to={`/reviews/${book.id}`}> 
                              <Card className={classes.bookCard}>
                                <CardMedia
                                  className={classes.media}
                                  image={!("imageLinks" in book.volumeInfo) ?  `${NoImage}` : `${book.volumeInfo.imageLinks.smallThumbnail}`}
                                  alt="Book" width="80px" height="100px"                  
                                />
                                <CardContent>
                                  {("averageRating" in book.volumeInfo) ? 
                                    <Rating name="read-only" value={book.volumeInfo.averageRating} precision={0.5} readOnly size="small"/> :
                                    <Rating name="read-only" value={0} precision={0.5} readOnly size="small"/>
                                  }
                                  <Typography gutterBottom variant="subtitle2" component="h2">
                                    {book.volumeInfo.title}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" component="p">
                                    {book.volumeInfo.authors}
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
              </Grid>
      
              <Grid container spacing={0}>
                <div>
                  <span>&nbsp;</span>
                  <Typography variant="h6" color="inherit">
                    Suosituimmat kirjat
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
