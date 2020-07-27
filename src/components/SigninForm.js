import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { auth_url } from '../config/dataLinks'
import axios from 'axios'
import ForgetPWForm from './ForgetPWForm'
import RegisterForm from './RegisterForm'

const logo = require('../images/logo.png')

const useStyles = makeStyles(theme => ({
  container1: {
    display: 'flex',
    margin: 20
  },
  container2: {
    display: 'flex'
  },
  grow: {
    flexGrow: 1
  },
  button1: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  },
  button2: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
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

export default function SigninForm({theme, triggerOpen, signinUser, initOpen}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const[username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [triggerForgetPW, setTriggerForgetPW] = useState(false)
  const [triggerRegister, setTriggerRegister] = useState(false)

  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  }, [triggerOpen, initOpen])

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const handleSignin = async () => {
    let signinFormData = new FormData()
    signinFormData.set('username', username)
    signinFormData.set('password', password)

    const config = {
      method: 'post',
      headers: {"Content-Type": 'multipart/form-data'},
      url: auth_url,
      data: signinFormData
    }

    let response = await axios(config)

    if (response.status === 200 && response.data.user) {
      let user = response.data.user
      setOpen(false)

      let isArtist = false
      
      if (user.capabilities.staff_members || user.capabilities.editor) {
        isArtist = true

        //Sign in artist to Google for Calendar access
        if (window.gapi) {
          if (!window.gapi.auth2.getAuthInstance().isSignedIn.get())
            window.gapi.auth2.getAuthInstance().signIn()
        }
        else {
          console.log("Error: gapi not loaded")
        }
      }        
      const payload = {
        firstName: user.firstname,
        lastName: user.lastname,
        nickName: user.nickname,
        email: user.email,
        id: user.id,
        loggedIn: true,
        isArtist: isArtist
      }
      signinUser(payload)
  }
    else {
      alert('login failed')
    }
  }

  const handleForget = () => {
    setOpen(false)
    setTriggerForgetPW(!triggerForgetPW)
  }

  const handleRegister = () => {
    setOpen(false)
    setTriggerRegister(!triggerRegister)
  }

  return (
    <>
      <Dialog open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container1}>
          <div className={classes.grow} />
          <img className={classes.logo} src={logo} alt="Hair on the move logo" />
          <div className={classes.grow} />
        </div>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Please login so that we can provide you with a better booking experience.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="username or email"
            type="username"
            fullWidth
            onChange={onChangeUsername}
          />
          <TextField
            margin="dense"
            label="password"
            type="password"
            fullWidth
            onChange={onChangePassword}
          />
        </DialogContent>
        <DialogActions className={classes.button1}>
          <Button variant="contained" onClick={handleSignin} color="primary" fullWidth>
            Sign in
          </Button>
        </DialogActions>
        <DialogActions className={classes.container2}>
          <div className={classes.grow} />
          <Button variant="text" onClick={handleForget} color="primary">
            Forget password?
          </Button>
          <div className={classes.grow} />
        </DialogActions>
        <div className={classes.container2}>
          <div className={classes.grow} />
          <p>OR</p>
          <div className={classes.grow} />
        </div>
        <DialogActions className={classes.button2}>
          <Button variant="contained" onClick={handleRegister} color="primary" fullWidth>
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
      <ForgetPWForm triggerOpen={triggerForgetPW}/>
      <RegisterForm triggerOpen={triggerRegister} signinUser={signinUser}/>
    </>
  )
}