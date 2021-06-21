import React, { useState, useEffect, useRef, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { clients_url } from '../config/dataLinks'
import { sendVerification, getClientByName } from '../utils/misc'
import EmailVeriForm from './EmailVeriForm'
import axios from 'axios'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'

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
  const { apiToken } = useContext(BookingsStoreContext)
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [triggerEmailConfirm, setTriggerEmailConfirm] = useState(false)
  const [key, setKey] = useState()
  const [userId, setUserId] = useState(null)

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

  const onChangeEmail = event => {
    setEmail(event.target.value.trim())
  }

  const onChangePassword = event => {
    setPassword(event.target.value.trim())
  }  

  const handleConfirm = code => {
    const secret = code.join('')
    if (key === secret) {
      setTriggerEmailConfirm(!triggerEmailConfirm)
      handleResetPW()
    }
    else {
      alert('The code you entered is incorrect.')
    }
  }

  const handleResetPW = async () => {
    const config = {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      url: clients_url,
      data: {
        client_id: userId,
        password: password
      }
    }

    try {
      let response = await axios(config)
      if (response.status === 200)
        alert('Your password has been reset successfully.')
      else
        alert('Your password reset failed.')

      setOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async () => {
    //Check if the user exists first
    try {
      let result = await getClientByName(apiToken, email)
      if (result.data.length !== 1) {
        alert('The email you entered does not exist in our user database.')
        return
      }
      setUserId(result.data[0].id)
    } catch (err) {
      console.log(err)
      return
    }    

    const sent = await sendVerification(email, setKey)
    
    if (!sent) return

    //open the confirmation dialog
    setTriggerEmailConfirm(!triggerEmailConfirm)
  }

  return (
    <>
      <Dialog open={open}>
      <DialogContent>
          <DialogContentText>
            To reset password, please enter your email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="email"
            type="email"
            fullWidth
            onChange={onChangeEmail}
          />
          <TextField
            required
            margin="dense"
            label="password"
            type="password"
            fullWidth
            defaultValue={password}
            onChange={onChangePassword}
          />
        </DialogContent>
        <DialogActions className={classes.button}>
          <Button variant="contained" onClick={handleClose} color="secondary" fullWidth>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="secondary" fullWidth>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <EmailVeriForm email={email} handleConfirm={handleConfirm} triggerOpen={triggerEmailConfirm}/>
    </>
  )
}