import React, { useState, useEffect, useRef} from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'


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

export default function SignoutForm({firstName, lastName, email, triggerOpen, signoutUser, resetBooking}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)

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

  const handleSignout = () => {
    signoutUser()
    resetBooking()
    setOpen(false)
  }

  return (
    <div>
      <Dialog maxWidth='xs' fullWidth open={open}>
        <div className={classes.container1}>
          <div className={classes.grow} />
          <ExitToAppIcon color='primary' fontSize='large'/>
          <div className={classes.grow} />
        </div>
        <DialogContent className={classes.container2}>
          <Typography variant='h6' align='center'>
            {firstName + ' ' + lastName}
          </Typography>
          <Typography variant='body2' align='center'>
            {email}
          </Typography>
        </DialogContent>  
        <DialogActions className={classes.button}>
          <Button variant="contained" onClick={handleClose} color="primary" fullWidth>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSignout} color="primary" fullWidth>
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}