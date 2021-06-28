import React, { useEffect, useState, useRef, useContext } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { auth_url } from '../config/dataLinks'
import axios from 'axios'
import ForgetPWForm from './ForgetPWForm'
import RegisterForm from './RegisterForm'
import logo from '../images/HBLC-logo-600.png'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'

const useStyles = makeStyles(theme => ({
  container1: {
    display: 'flex',
    marginTop: 10
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
    marginTop: 10
  },
  button2: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 20
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

export default function SigninForm({theme, triggerOpen, signinUser, initOpen}) {
  const { apiToken } = useContext(BookingsStoreContext)
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const[username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [triggerForgetPW, setTriggerForgetPW] = useState(false)
  const [triggerRegister, setTriggerRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

    setIsLoading(true)
    let response = await axios(config)
    setIsLoading(false)
    if (response.status === 200 && response.data.user) {
      const user = response.data.user
      setOpen(false)

      const payload = {
        email: user.email,
        id: user.id,
        loggedIn: true
      }
      signinUser(apiToken, payload)
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
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container1}>
          <div className={classes.grow} />
          <img className={classes.logo} src={logo} alt="Hair Beauty Life Co logo" />
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
        {isLoading ?
          <div className={classes.progress}>
            <CircularProgress color='primary' />
          </div>
         :
          <DialogActions className={classes.button1}>
            <Button variant="contained" onClick={handleSignin} color="secondary" fullWidth>
              Sign in
            </Button>
          </DialogActions>
        }
        <div className={classes.container2}>
          <div className={classes.grow} />
          <Button variant="text" onClick={handleForget} color="primary">
            Forget password?
          </Button>
          <div className={classes.grow} />
        </div>
        <div className={classes.container2}>
          <div className={classes.grow} />
          <Typography variant="subtitle2">OR</Typography>
          <div className={classes.grow} />
        </div>
        <div className={classes.button2}>
          <Button variant="contained" onClick={handleRegister} color="secondary" fullWidth>
            Create Account
          </Button>
        </div>
      </Dialog>
      <ForgetPWForm triggerOpen={triggerForgetPW}/>
      <RegisterForm triggerOpen={triggerRegister} signinUser={signinUser} apiToken={apiToken}/>
    </>
  )
}