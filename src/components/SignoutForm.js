import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function SignoutForm({firstName, lastName, email, signoutUser, resetBooking}) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles()

  const handleClose = () => {
    signoutUser()
    resetBooking()
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className={classes.container}>
          <DialogContentText>
            {firstName + ' ' + lastName}
          </DialogContentText>
        </DialogContent>
        <DialogContent className={classes.container}>
          <DialogContentText>
            {email}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.button}>
          <Button variant="contained" onClick={handleClose} color="primary" fullWidth>
            Sign out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}