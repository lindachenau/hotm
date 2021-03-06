import React, { useState, useEffect, useRef } from 'react'
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

export default function SignoutForm({triggerOpen, signoutUser, resetBooking, name, email}) {
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
    
    //Sign out artist from Google for Calendar access
    if (window.gapi) {
      window.gapi.auth2.getAuthInstance().signOut()
    }
  }

  return (
    <Dialog maxWidth='xs' fullWidth open={open}>
      <div className={classes.container1}>
        <div className={classes.grow} />
        <ExitToAppIcon color='primary' fontSize='large'/>
        <div className={classes.grow} />
      </div>
      <DialogContent className={classes.container2}>
        <Typography variant='h6' align='center'>
          {name}
        </Typography>
        <Typography variant='body2' align='center'>
          {email}
        </Typography>
      </DialogContent>  
      <DialogActions className={classes.button}>
        <Button variant="contained" onClick={handleClose} color="secondary" fullWidth>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSignout} color="secondary" fullWidth>
          Sign out
        </Button>
      </DialogActions>
    </Dialog>
  )
}