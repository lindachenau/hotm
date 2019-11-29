import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { makeStyles } from '@material-ui/core/styles'
import { auth_url } from '../config/dataLinks'
import axios from 'axios'
import ForgetPWForm from './ForgetPWForm'

const logo = require('../images/logo.png')

const useStyles = makeStyles(() => ({
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
  }
}))

export default function SigninForm({triggerOpen, signinUser, initOpen}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const[username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [triggerForgetPW, setTriggerForgetPW] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  }, [triggerOpen])

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const handleSignin = async () => {
    const url = auth_url + '/?username=' + username + '&password=' + password

    let response = await axios(url)

    if (response.status == 200 && response.data.user) {
      let user = response.data.user
      const payload = {
        firstName: user.firstname,
        lastName: user.lastname,
        nickName: user.nickname,
        email: user.email,
        id: user.id,
        loggedIn: true
      }
      signinUser(payload)
      setOpen(false)
    }
    else {
      alert('login failed')
    }
  }

  const handleForget = () => {
    setTriggerForgetPW(!triggerForgetPW)
  }

  const handleRegister = () => {}

  return (
    <div>
      <Dialog open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container1}>
          <div className={classes.grow} />
          <img width={120} src={logo} alt="Hair on the move logo" />
          <div className={classes.grow} />
        </div>
        <DialogContent>
          <DialogContentText>
            To continue booking or manage your bookings, please sign in or registertriggerForgetPW.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="username"
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
            Register
          </Button>
        </DialogActions>
      </Dialog>
      <ForgetPWForm triggerOpen={triggerForgetPW}/>
    </div>
  )
}