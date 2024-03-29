import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { register_nonce_url, register_url, update_user_meta_url } from '../config/dataLinks'
import { sendVerification, getClientByName } from '../utils/misc'
import axios from 'axios'
import EmailVeriForm from './EmailVeriForm'
import logo from '../images/HBLC-logo-540.png'

const useStyles = makeStyles(theme => ({
  container1: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1
  },
  button1: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  logo: {
    width: 200,
    height: 200,
    [theme.breakpoints.down('sm')]: {
      width: 120,
      height: 120
    }
  },
  progress: {
    display: 'flex',
    justifyContent: 'center'
  }    
}))

export default function RegisterForm({triggerOpen, signinUser, apiToken}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateAbbr, setStateAbbr] = useState('')
  const [postcode, setPostcode] = useState('')
  const [phone, setPhone] = useState('')
  const classes = useStyles()
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [triggerEmailConfirm, setTriggerEmailConfirm] = useState(false)
  const [key, setKey] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (username === '' || password === '' || confirmedPassword === '' || email === '' || firstName === '' || lastName === '' || phone === '')
      setDisableSubmit(true)
    else
      setDisableSubmit(false)
  },[username, password, confirmedPassword, email, firstName, lastName, phone])

  useEffect(() => {
    if (didMountRef.current)
      setOpen(true)
    else
      didMountRef.current = true
  }, [triggerOpen])

  //Clear register form whenever it's closed
  useEffect(() => {
    if (!open) {
      setUsername('')
      setPassword('')
      setConfirmedPassword('')
      setEmail('')
      setFirstName('')
      setLastName('')
      setCompany('')
      setAddress('')
      setCity('')
      setStateAbbr('')
      setPostcode('')
      setPhone('')
    }
  }, [open])

  const onChangeUsername = event => {
    setUsername(event.target.value.trim())
  }

  const onChangePassword = event => {
    setPassword(event.target.value.trim())
  }

  const onChangeConfirmedPassword = event => {
    setConfirmedPassword(event.target.value.trim())
  }

  //check retyped password matches
  useEffect(() => {
    let matched = true
    for (let i = 0; i < confirmedPassword.length; i++) {
      if (confirmedPassword[i] !== password[i]) {
        matched = false
      }
    }

    if (!matched || confirmedPassword.length > password.length)
      alert("Re-typed password does not match. Please type again.")

  }, [password, confirmedPassword]) 

  const onChangeEmail = event => {
    setEmail(event.target.value.trim())
  }

  const onChangeFirstName = event => {
    setFirstName(event.target.value)
  }

  const onChangeLastName = event => {
    setLastName(event.target.value)
  }

  const onChangeCompany = event => {
    setCompany(event.target.value)
  }

  const onChangeAddress = event => {
    setAddress(event.target.value)
  }

  const onChangeCity = event => {
    setCity(event.target.value)
  }

  const onChangeStateAbbr = event => {
    setStateAbbr(event.target.value.trim())
  }

  const onChangePostcode = event => {
    setPostcode(event.target.value.trim())
  }

  const onChangePhone= event => {
    setPhone(event.target.value)
  }

  const checkExistence = async () => {
    const users1 = await getClientByName(apiToken, email)
    if (users1.data.length > 0) {
      alert("Email exists. Login or reset password.")
      return true
    } 

    const users2 = await getClientByName(apiToken, username)
    if (users2.data.length > 0) {
      alert("Username exists. Please change to a different username.")
      return true
    } 

    return false
  }

  const handleConfirm = code => {
    const secret = code.join('')
    if (key === secret) {
      setTriggerEmailConfirm(!triggerEmailConfirm)
      handleRegister()
    }
    else {
      alert('The code you entered is incorrect.')
    }
  }

  const handleRegister = async () => {
    //get nonce
    let nonce
    try {
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: register_nonce_url
      }
      const nonceResponse = await axios(config)
      nonce = nonceResponse.data.nonce
    }
    catch (nonceErr) {
      alert(nonceErr)
      return
    }

    //register
    let regResponse
    try {
      let userFormData = new FormData()
      userFormData.set('username', username)
      userFormData.set('user_pass', password)
      userFormData.set('email', email)
      userFormData.set('display_name', `${firstName} ${lastName}`)
      userFormData.set('nonce', nonce)

      const config = {
        method: 'post',
        headers: {"Content-Type": 'multipart/form-data'},
        url: register_url,
        data: userFormData
      }

      setIsLoading(true)
      regResponse = await axios(config)
      
      if (regResponse && regResponse.data.status !== 'ok') {
        setIsLoading(false)
        alert(regResponse.data.error)
        return
      }
    }
    catch (regErr) {
      setIsLoading(false)
      alert(regErr)
    }

    //write metadata
    try {
      const cookie = regResponse.data.cookie
      const userId = regResponse.data.user_id

      let metaFormData = new FormData()
      metaFormData.set('cookie', cookie)
      metaFormData.set('first_name', firstName)
      metaFormData.set('last_name', lastName)
      metaFormData.set('billing_company', company)
      metaFormData.set('billing_address_1', address)
      metaFormData.set('billing_city', city)
      metaFormData.set('billing_state', stateAbbr)
      metaFormData.set('billing_postcode', postcode)
      metaFormData.set('billing_phone', phone)

      const metaConfig = {
        method: 'post',
        headers: {"Content-Type": 'multipart/form-data'},
        url: update_user_meta_url,
        data: metaFormData
      }
  
      let metaResponse = await axios(metaConfig)
      if (metaResponse && metaResponse.data.status !== 'ok') {
        setIsLoading(false)
        alert(metaResponse.data.error)
        return
      }

      const payload = {
        firstName,
        lastName,
        email: email,
        id: userId,
        loggedIn: true
      }

      signinUser(apiToken, payload)
      setIsLoading(false)
      alert('You are now registered for Hair Beauty Life Co online booking!')
      setOpen(false)
    }
    catch (metaErr) {
      setIsLoading(false)
      alert(metaErr)
    }
  }

  const handleSubmit = async () => {
    /*
     * Check if username or email exist first
     */ 
    const existence = await checkExistence()
    if (existence) return

    /*
     * username and email are unique. Now verify email by sending a verification link to email.
     * Call EMAIL_VERIFICATION server to do so.
     */ 
    const sent = await sendVerification(email, setKey)
    
    if (!sent) return

    //open the confirmation dialog
    setTriggerEmailConfirm(!triggerEmailConfirm)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container1}>
          <div className={classes.grow} />
          <img className={classes.logo} src={logo} alt="Hair Beauty Life Co logo" />
          <div className={classes.grow} />
        </div>
        <DialogContent>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                autoFocus
                required
                margin="dense"
                label="username"
                type="text"
                fullWidth
                defaultValue={username}
                onChange={onChangeUsername}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="email"
                type="email"
                fullWidth
                defaultValue={email}
                onChange={onChangeEmail}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="password"
                type="password"
                fullWidth
                defaultValue={password}
                onChange={onChangePassword}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="confirm pw"
                type="password"
                fullWidth
                defaultValue={confirmedPassword}
                onChange={onChangeConfirmedPassword}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="first name"
                type="text"
                fullWidth
                defaultValue={firstName}
                onChange={onChangeFirstName}
              />
            </Grid>  
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="last name"
                type="text"
                fullWidth
                defaultValue={lastName}
                onChange={onChangeLastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="company"
                type="text"
                fullWidth
                defaultValue={company}
                onChange={onChangeCompany}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="address"
                type="text"
                fullWidth
                defaultValue={address}
                onChange={onChangeAddress}
              />
            </Grid>  
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="city"
                type="text"
                fullWidth
                defaultValue={city}
                onChange={onChangeCity}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="postcode"
                type="text"
                fullWidth
                defaultValue={postcode}
                onChange={onChangePostcode}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="state"
                type="text"
                fullWidth
                defaultValue={stateAbbr}
                onChange={onChangeStateAbbr}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                margin="dense"
                label="phone"
                type="tel"
                fullWidth
                defaultValue={phone}
                onChange={onChangePhone}
              />
            </Grid>  
          </Grid>
        </DialogContent>
        {isLoading ?
          <div className={classes.progress}>
            <CircularProgress color='primary' />
          </div>
          :
          <DialogActions className={classes.button1}>
            <Button variant="contained" onClick={handleSubmit} color="secondary" fullWidth disabled={disableSubmit}>
              Submit
            </Button>
          </DialogActions>
        }
      </Dialog>
      <EmailVeriForm email={email} handleConfirm={handleConfirm} triggerOpen={triggerEmailConfirm}/>
    </>
  )
}