import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { register_nonce_url, register_url, update_user_meta_url } from '../config/dataLinks'
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
    if (username === '' || password === '' || email === '' || firstName === '' || lastName === '' || phone === '')
      setDisableSubmit(true)
    else
      setDisableSubmit(false)
  },[username, password, email, firstName, lastName, phone])

  useEffect(() => {
    if (didMountRef.current)
      setOpen(true)
    else
      didMountRef.current = true
  }, [triggerOpen])

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

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
              onChange={onChangeUsername}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              margin="dense"
              label="password"
              type="password"
              fullWidth
              onChange={onChangePassword}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              margin="dense"
              label="email"
              type="email"
              fullWidth
              onChange={onChangeEmail}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              margin="dense"
              label="first name"
              type="firstname"
              fullWidth
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
              onChange={onChangeLastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="company"
              type="company"
              fullWidth
              onChange={onChangeCompany}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="address"
              type="address"
              fullWidth
              onChange={onChangeAddress}
            />
          </Grid>  
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="city"
              type="city"
              fullWidth
              onChange={onChangeCity}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="postcode"
              type="postcode"
              fullWidth
              onChange={onChangePostcode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="state abbr."
              type="state"
              fullWidth
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