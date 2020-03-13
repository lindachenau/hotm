import React, { useState, useEffect, useRef} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20
  },
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  },
  digit: {
    margin: 2
  }
}))

export default function EmailVeriForm({ email, handleConfirm, triggerOpen }) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [code, setCode] = useState([" ", " ", " ", " ", " ", " "])
  const digit1 = useRef(null)
  const digit2 = useRef(null)
  const digit3 = useRef(null)
  const digit4 = useRef(null)
  const digit5 = useRef(null)

  const classes = useStyles()

  useEffect(() => {
    //keep closed after mount
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
    digit1.current.focus()
  }

  const handleDigit1 = event => {
    let newCode = code
    newCode[1] = event.target.value
    setCode(newCode)
    digit2.current.focus()
  }

  const handleDigit2 = event => {
    let newCode = code
    newCode[2] = event.target.value
    setCode(newCode)
    digit3.current.focus()
  }

  const handleDigit3 = event => {
    let newCode = code
    newCode[3] = event.target.value
    setCode(newCode)
    digit4.current.focus()
  }

  const handleDigit4 = event => {
    let newCode = code
    newCode[4] = event.target.value
    setCode(newCode)
    digit5.current.focus()
  }

  const handleDigit5 = event => {
    let newCode = code
    newCode[5] = event.target.value
    setCode(newCode)
  }

  const oneDigit = {
    maxLength: "1", 
    size: "1"
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
        <TextField variant="outlined" size='small' autoFocus inputProps={oneDigit} className={classes.digit} key='code_digit0' onChange={handleDigit0}/>
        <TextField variant="outlined" size='small' inputProps={oneDigit} className={classes.digit} key='code_digit1' onChange={handleDigit1} inputRef={digit1}/>
        <TextField variant="outlined" size='small' inputProps={oneDigit} className={classes.digit} key='code_digit2' onChange={handleDigit2} inputRef={digit2}/>
        <TextField variant="outlined" size='small' inputProps={oneDigit} className={classes.digit} key='code_digit3' onChange={handleDigit3} inputRef={digit3}/>
        <TextField variant="outlined" size='small' inputProps={oneDigit} className={classes.digit} key='code_digit4' onChange={handleDigit4} inputRef={digit4}/>
        <TextField variant="outlined" size='small' inputProps={oneDigit} className={classes.digit} key='code_digit5' onChange={handleDigit5} inputRef={digit5}/>
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