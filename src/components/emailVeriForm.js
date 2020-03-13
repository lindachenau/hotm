import React, { useState, useEffect, useRef} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  },
  digit: {
    textAlign: 'center',
    border: '1px solid',
    margin: 2
  }
}))

export default function EmailVeriForm({ email, handleConfirm, triggerOpen }) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [code, setCode] = useState([" ", " ", " ", " ", " ", " "])

  const classes = useStyles()

  useEffect(() => {
    if (didMountRef.current)
      setOpen(!open)
    else
      didMountRef.current = true
  }, [triggerOpen])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDigit0 = event => {
    let newCode = code
    newCode[0] = event.target.value
    setCode(newCode)
  }

  const handleDigit1 = event => {
    let newCode = code
    newCode[1] = event.target.value
    setCode(newCode)
  }

  const handleDigit2 = event => {
    let newCode = code
    newCode[2] = event.target.value
    setCode(newCode)
  }

  const handleDigit3 = event => {
    let newCode = code
    newCode[3] = event.target.value
    setCode(newCode)
  }

  const handleDigit4 = event => {
    let newCode = code
    newCode[4] = event.target.value
    setCode(newCode)
  }

  const handleDigit5 = event => {
    let newCode = code
    newCode[5] = event.target.value
    setCode(newCode)
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={open}>
      <DialogTitle>
        Confirm your email address
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' align='left'>
          { `A secret code has been sent to ${email} for confirmation. If you do not receive the confirmation code within a minute after submitting, please check your Spam folder. Enter the secret code to confirm your email address.` }
        </Typography>
      </DialogContent> 
      <div  className={classes.container}>
        <Input autoFocus inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit0' onChange={handleDigit0}/>
        <Input inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit1' onChange={handleDigit1}/>
        <Input inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit2' onChange={handleDigit2}/>
        <Input inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit3' onChange={handleDigit3}/>
        <Input inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit4' onChange={handleDigit4}/>
        <Input inputProps={{maxLength: "1", size: "1"}} className={classes.digit} key='code_digit5' onChange={handleDigit5}/>
      </div>
      <DialogActions className={classes.button}>
        <Button variant="contained" onClick={handleClose} color="primary" fullWidth>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => handleConfirm(code)} color="primary" fullWidth>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}