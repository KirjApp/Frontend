// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Näkymän luonnin perusrunko. Olen hyödyntänyt Full stack open 2020
// 2020 -kurssilla (Helsingin yliopisto) oppimaani
//
// Kuvaus: Profiilin luonti sovellukseen. Näkymässä voidaan luoda
// käyttäjän profiili antamalla nimimerkki ja salasana, jotka tallennetaan
// tietokantaan

import React, { useState, /*useEffect*/ } from "react";
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
    width: '70%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CreateProfilePage = () => {
  
  // nimimerkki
  const [ writer, setWriter ] = useState("");
  // salasana
  const [ password, setPassword ] = useState("");
  // Viestit
  const [ message, setMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState("")

  const classes = useStyles();
  
  const createProfile = async (event) => {
    event.preventDefault()

    const newUserObject = {
      username: writer,
      password: password,
    }
  
    setWriter('')
    setPassword('')
    const newUser = await bookService
      .createUser(newUserObject)  
      .catch (error =>  {
        console.log(error)
        setMessageType("error")
        setMessage("Käyttäjän tallentamisessa tapahtui virhe")
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }) 
    setMessageType("success")
    setMessage(`Käyttäjä ${newUser.username} on tallennettu`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
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
                  {(writer && password) ? <Button variant="contained" id={"createProfileButton"} onClick={createProfile}> Luo profiili</Button> : <Button variant="contained" id={"createProfileButton"} disabled onClick={createProfile}> Luo profiili</Button>}   
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