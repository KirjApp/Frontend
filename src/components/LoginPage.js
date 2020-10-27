// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Näkymän luonnin perusrunko. Olen hyödyntänyt Full stack open 2020
// 2020 -kurssilla (Helsingin yliopisto) oppimaani
//
// Kuvaus: Näkymässä voidaan kirjautua sovellukseen antamalla
// nimimerkki ja salasana

import React, { useState, useEffect } from "react";
import bookService from "../services/data";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
// tekstityylit
import Typography from '@material-ui/core/Typography';
// tekstikenttien näyttäminen
import FormGroup from '@material-ui/core/FormGroup';
// painonappi arvostelun lähettämiseen
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

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

  // kirjautunut käyttäjä
  const [user, setUser] = useState(null); 
  // nimimerkki
  const [writer, setWriter] = useState("");
  // salasana
  const [password, setPassword] = useState("");
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")

  const classes = useStyles();
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      //console.log(user)
      //console.log(`Käyttäjä ${user.username} on kirjautuneena`)
      bookService.setToken(user.token)
    }
  }, [])
  
  const handleLogin = async (event) => {
    event.preventDefault()

    const userObject = {
      username: writer,
      password: password,
    }
  
    setWriter("")
    setPassword("")
    const loggedUser = await bookService
      .loginUser(userObject)
      .catch (error =>  {
        console.log(error)
        setMessageType("error")
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    if (loggedUser) {
      window.localStorage.setItem(
        "loggedUser", JSON.stringify(loggedUser)
      )
      // asetetaan token kirjautuneelle käyttäjälle
      bookService.setToken(loggedUser.token)
      await setUser(loggedUser)
      props.onLoggedUser(loggedUser);
      setMessageType("success")
      setMessage(`Käyttäjä ${loggedUser.username} on kirjautunut`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  // writer input
  const handleWriterChange = (event) => {
    setWriter(event.target.value)
  }
    
  // review input
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
                  {(writer && password) ? <Button variant="contained" id={"loginButton"} onClick={handleLogin}> Kirjaudu sisään</Button> : <Button variant="contained" id={"loginButton"} disabled onClick={handleLogin}> Kirjaudu sisään</Button>}   
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
