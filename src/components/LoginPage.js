// Contributor(s): Esa Mäkipää
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
// Kuvaus: Näkymässä voidaan kirjautua sovellukseen antamalla
// nimimerkki ja salasana
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-license. 

import React, { useState, useEffect } from "react";
// promiset
import { loginUser, setToken} from "../services/data";
// tyylit
import { makeStyles } from "@material-ui/core/styles";
// grid
import Grid from "@material-ui/core/Grid";
// tekstikenttä
import TextField from '@material-ui/core/TextField';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// tekstikenttien näyttäminen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi
import Button from '@material-ui/core/Button';
// ilmoitusten näyttäminen (virheet ja onnistuneet toiminnot)
import Alert from '@material-ui/lab/Alert';
// navigointi
import { useHistory } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  // viestien asetukset (arvostelun lisäämisen onnistuminen tai epäonnistuminen)
  message: {
    width: "70%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const LoginPage = ( props ) => {

  // history-olio, jota voidaan käyttää navigoinnissa 
  const history = useHistory()

  // kirjautunut käyttäjä
  const [ , setUser ] = useState(null); 
  // nimimerkki
  const [ writer, setWriter ] = useState("");
  // salasana
  const [ password, setPassword ] = useState("");
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")

  const classes = useStyles();
  
  // kirjautuneen käyttäjän haku local storagesta
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])
  
  // kirjautuminen
  const handleLogin = async (event) => {
    event.preventDefault()
    
    // käyttäjä-objekti
    const userObject = {
      username: writer,
      password: password,
    }
  
    setWriter("")
    setPassword("")
    // kirjautuminen
    const loggedUser = await loginUser(userObject)
      .catch (error =>  {
        setMessageType("error")
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
    if (loggedUser) {
      window.localStorage.setItem(
        "loggedUser", JSON.stringify(loggedUser)
      )
      // asetetaan token kirjautuneelle käyttäjälle
      setToken(loggedUser.token)
      await setUser(loggedUser)
      // palautetaan tieto kirjutuneesta etusivulle
      props.onLoggedUser(loggedUser)
      setMessageType("success")
      setMessage(`Käyttäjä ${loggedUser.username} on kirjautunut`)
      setTimeout(() => {
        setMessage(null)
        // onnnistuneen kirjautumisen jälkeen näytetään etusivu (kirjojen haku)
        history.push("/")
      }, 1000)
    }
  }

  // asetetaan nimimerkki
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  }
    
  // asetetaan arvostelu
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
	
  return (
    <div>
      <br />
      <Grid container spacing={0}>
        <div>
          <br />
            <Typography variant="h6" color="inherit">
              Kirjautuminen
            </Typography>
        </div>  
      </Grid>    

      <Grid container spacing={2}>
        <div>
          <FormGroup>
            <span>&nbsp;</span>
            <TextField id="writer" value={writer} variant="outlined"  size="small" onChange={handleWriterChange} label="Nimimerkki"/>
            <span>&nbsp;</span>
            <TextField id="password" value={password} variant="outlined" size="small" type="password" onChange={handlePasswordChange} label="Salasana"/>            
          </FormGroup>
        </div>
        <div style={{width: "100%"}}>     
          <br />
          <Grid container spacing={1}>
            <Grid container item xs={12} spacing={0} padding={0}>
              <Grid item xs={4}>
                <div>
                  {(writer && password) ? <Button variant="contained" id={"loginButton"} onClick={handleLogin} title="Kirjaudu sisään"> Kirjaudu sisään</Button> : <Button variant="contained" id={"loginButton"} disabled onClick={handleLogin}> Kirjaudu sisään</Button>}   
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
    </div>
  )
}

export default LoginPage;
