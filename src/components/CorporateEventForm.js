import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import CreateIcon from '@material-ui/icons/Create'
import { makeStyles } from '@material-ui/core/styles'
import AddJobDescription from '../components/DropdownList'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: 20
  },
  grow: {
    flexGrow: 1
  },  
  textField : {
    width: "100%"
  },
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  },
  job: {
    marginTop: 10,
    marginBottom: 5
  }
}))

export default function CorporateEventForm({theme, triggerOpen, corporate, initOpen, taskList, task, setTask, onSaveEventDetails, onDeleteEvent}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [location, setLocation] = useState()
  const [contact, setContact] = useState()
  const [comment, setComment] = useState('')
  
  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
      setLocation(corporate ? corporate.location : '')
      setContact(corporate ? `${corporate.contactPerson} - ${corporate.contactPhone}` : '')
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  }, [triggerOpen, initOpen])

  const onChangeLocation = event => {
    setLocation(event.target.value)
  }

  const onChangeContact = event => {
    setContact(event.target.value)
  }

  const handleSaveEventDetails = () => {
    if (task)
      onSaveEventDetails(task.name)
    setOpen(false)
  }

  const handleDeleteEvent = () => {
    onDeleteEvent()
    setOpen(false)
  }


  return (
    <>
      <Dialog open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container}>
          <div className={classes.grow} />
          <CreateIcon color='primary' fontSize='large'/>
          <div className={classes.grow} />
        </div>
        <DialogContent>
          <TextField
            defaultValue={location}
            required
            margin="dense"
            label="location"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChangeLocation}
          />
            <TextField
            defaultValue={contact}
            required
            margin="dense"
            label="contact"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChangeContact}
          />
          <div className={classes.job}>
            <AddJobDescription
              options={taskList}
              id="task-list"
              label="Job description"
              placeholder="job description"
              setTag={setTask}
              tag={task}          
            />
          </div>
          <TextField
            id="outlined-textarea"
            label="Additional instructions"
            placeholder="Additional instructions"
            multiline
            className={classes.textField}
            margin="dense"
            variant="outlined"
            onChange={(event) => setComment(event.target.value)}
          />          
        </DialogContent>
        <DialogActions className={classes.button}>
          <Button variant="contained" onClick={handleDeleteEvent} color="primary" fullWidth>
            Delete
          </Button>
          <Button variant="contained" onClick={handleSaveEventDetails} color="primary" fullWidth>
            Done
          </Button>
        </DialogActions>         
      </Dialog>
    </>
  )
}