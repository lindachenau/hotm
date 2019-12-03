import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { reset_pw_url } from '../config/dataLinks'
import axios from 'axios'

const useStyles = makeStyles(() => ({
  container1: {
    display: 'flex',
    margin: 20
  },
  grow: {
    flexGrow: 1
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center'
  },
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function ForgetPWForm({triggerOpen}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [userLogin, setUserLogin] = useState('')

  const classes = useStyles()

  useEffect(() => {
    if (didMountRef.current)
      setOpen(true)
    else
      didMountRef.current = true
  }, [triggerOpen])

  const handleClose = () => {
    setOpen(false)
  }

  const onChangeUserLogin = event => {
    setUserLogin(event.target.value)
  }

  const handleResetPW = async () => {
    const url = reset_pw_url + userLogin

    let response = await axios(url)

    if (response.status == 200) {
      let data = response.data

      if (data.status == 'ok') {
        alert('An email to reset your password has been sent to you.')
        setOpen(false)
      }
      else {
        alert('username or email not found')
      }
    }
    else {
      alert('username or email not found')
    }
  }

  return (
    <div>
      <Dialog open={open}>
      <DialogContent>
          <DialogContentText>
            To reset password, please enter your username or email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="username or email"
            type="userLogin"
            fullWidth
            onChange={onChangeUserLogin}
          />
        </DialogContent>
        <DialogActions className={classes.button}>
          <Button variant="contained" onClick={handleClose} color="primary" fullWidth>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleResetPW} color="primary" fullWidth>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}