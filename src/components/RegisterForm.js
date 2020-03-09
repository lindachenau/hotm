import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { register_nonce_url, register_url, update_user_meta_url, email_verification_server, user_url, access_token } from '../config/dataLinks'
import axios from 'axios'

const logo = require('../images/logo.png')

const useStyles = makeStyles(theme => ({
  container1: {
    display: 'flex',
    margin: 20
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
    maxWidth: '50%',
    width: 'auto',
    height: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 120,
    }
  }
}))

export default function RegisterForm({triggerOpen, signinUser}) {
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
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onChangeConfirmedPassword = event => {
    setConfirmedPassword(event.target.value)
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
    setEmail(event.target.value)
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
    setStateAbbr(event.target.value)
  }

  const onChangePostcode = event => {
    setPostcode(event.target.value)
  }

  const onChangePhone= event => {
    setPhone(event.target.value)
  }

  const handleRegister = async () => {

    /*
     * Check if username or email exist first
     */ 
    const config1 = {
      method: 'get',
      headers: { 'Authorization': access_token },
      url: `${user_url}?search=${email}`
    }

    const users1 = await axios(config1)
    if (users1.data.length > 0) {
      alert("Email exists. Login or reset password.")
      return
    } 

    const config2 = {
      method: 'get',
      headers: { 'Authorization': access_token },
      url: `${user_url}?search=${username}`
    }

    const users2 = await axios(config2)
    if (users2.data.length > 0) {
      alert("Username exists. Please change to a different username.")
      return 
    } 

    /*
     * username and email are unique. Now verify email by sending a verification link to email.
     * Call EMAIL_VERIFICATION server to do so.
     */ 
    try {
      const reqConfig = {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        url: `${email_verification_server}/send`,
        data: {
          id: username,
          email: email
        }
      }

      const sendRes = await axios(reqConfig)
      if (sendRes.status === 200) {
        alert(`An email has been sent to ${email} for verification. If you do not receive the verification message within a minute of signing up, please check your Spam folder just in case the verification email got delivered there instead of your inbox. If so, select the verification message and click Not Spam, which will allow future messages to get through.`)
      }
    }
    catch (error) {
      alert(error)
      return
    }

    try {
      const checkRes = await axios.get(`${email_verification_server}/check?id=${username}`)
      if (checkRes.data.error) {
        alert(`Timeout: Email has not been verified in 30 seconds. Click Submit to send the verification email again.`)
        return
      }
    }
    catch (error) {
      alert(`Timeout: Email has not been verified in 30 seconds. Click Submit to send the verification email again.`)
      return
  }

    let nonceResponse = await axios(register_nonce_url)

    if (nonceResponse.status === 200 && nonceResponse.data.status === 'ok') {
      const nonce = nonceResponse.data.nonce

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

      let regResponse = await axios(config)

      if (regResponse.status === 200 && regResponse.data.status === 'ok') {
        const cookie = regResponse.data.cookie
        const user_id = regResponse.data.user_id

        let metaFormData = new FormData()
        metaFormData.set('cookie', cookie)
        metaFormData.set('billing_firstname', firstName)
        metaFormData.set('billing_lastname', lastName)
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

        if (metaResponse.status === 200 && metaResponse.data.status === 'ok') {
          const payload = {
            firstName,
            lastName,
            nickName: firstName,
            email: email,
            id: user_id,
            loggedIn: true
          }
          signinUser(payload)
          alert('You are now registered for HOTM online booking!')
          setOpen(false)
        }
        else {
          alert(metaResponse.data.error)
        }
      }
      else {
        alert(regResponse.data.error)
      }
    }
    else {
      alert(nonceResponse.data.error)
    }
  }

  return (
    <Dialog open={open} onBackdropClick={() => setOpen(false)}>
      <div className={classes.container1}>
        <div className={classes.grow} />
        <img className={classes.logo} src={logo} alt="Hair on the move logo" />
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
              type="username"
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
              type="firstname"
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
              type="lastname"
              fullWidth
              defaultValue={lastName}
              onChange={onChangeLastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="company"
              type="company"
              fullWidth
              defaultValue={company}
              onChange={onChangeCompany}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="address"
              type="address"
              fullWidth
              defaultValue={address}
              onChange={onChangeAddress}
            />
          </Grid>  
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="city"
              type="city"
              fullWidth
              defaultValue={city}
              onChange={onChangeCity}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="postcode"
              type="postcode"
              fullWidth
              defaultValue={postcode}
              onChange={onChangePostcode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="state abbr."
              type="state"
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
              type="phone"
              fullWidth
              defaultValue={phone}
              onChange={onChangePhone}
            />
          </Grid>  
        </Grid>
      </DialogContent>
      <DialogActions className={classes.button1}>
        <Button variant="contained" onClick={handleRegister} color="primary" fullWidth disabled={disableSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}