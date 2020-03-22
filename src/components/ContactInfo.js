import React, { useState, useEffect, useRef} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import { contact_phone } from '../config/dataLinks'


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
    alignContent: 'center',
    marginBottom: 30
  }
}))

export default function ContactInfo({triggerOpen}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)

  const classes = useStyles()

  useEffect(() => {
    if (didMountRef.current)
      setOpen(true)
    else
      didMountRef.current = true
  }, [triggerOpen])

  return (
    <Dialog maxWidth='xs' open={open} onBackdropClick={() => setOpen(false)}>
      <div className={classes.container1}>
        <div className={classes.grow} />
        <ContactPhoneIcon color='primary' fontSize='large'/>
        <div className={classes.grow} />
      </div>
      <DialogContent className={classes.container2}>
        <Typography variant='h6' align='center'>
          {contact_phone}
        </Typography>
        <Typography variant='body2' align='center'>
          This service requires multiple artists. Please call to let us arrange artists for you.
          All artists travel to any location however additional travel fees, 
          accommodation and food allowances to be discussed prior. 
        </Typography>
      </DialogContent>  
    </Dialog>
  )
}