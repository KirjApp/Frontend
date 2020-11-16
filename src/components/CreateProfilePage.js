// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Näkymän luonnin perusrunko
//
// Kuvaus: Profiilin luonti sovellukseen. Näkymässä voidaan luoda
// käyttäjän profiili antamalla nimimerkki ja salasana, jotka tallennetaan
// tietokantaan

import React, { useState } from "react";
// promiset
import bookService from "../services/data";
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
    width: '70%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CreateProfilePage = () => {

  // history-olio, jota voidaan käyttää navigoinnissa 
  const history = useHistory()

  // nimimerkki
  const [ writer, setWriter ] = useState("");
  // salasana
  const [ password, setPassword ] = useState("");
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")

  const classes = useStyles();

  // profiilin luonti
  const createProfile = async (event) => {
    event.preventDefault()

    // muodostetaan käyttäjä-objekti
    const newUserObject = {
      username: writer,
      password: password,
    }
  
    setWriter('')
    setPassword('')
    // luodaan ja tallennetaan käyttäjä
    const newUser = await bookService
      .createUser(newUserObject)  
      .catch (error =>  {
        setMessageType("error")
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
    if (newUser) {  
      setMessageType("success")
      setMessage(`Käyttäjä ${newUser.username} on tallennettu`)
      setTimeout(() => {
        setMessage(null)
        // onnnistuneen profiilin luonnin jälkeen näytetään etusivu (kirjojen haku)
        history.push("/")
      }, 2000)
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
              Profiilin luonti
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
                  {(writer && password) ? <Button variant="contained" id={"createProfileButton"} onClick={createProfile} title="Luo profiili">Luo profiili</Button> : <Button variant="contained" id={"createProfileButton"} disabled onClick={createProfile}> Luo profiili</Button>}   
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

export default CreateProfilePage;
