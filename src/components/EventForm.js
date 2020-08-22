import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import CreateIcon from '@material-ui/icons/Create'
import { makeStyles } from '@material-ui/core/styles'
import AddJobDescription from '../components/DropdownList'
import LocationSearchInput from './LocationSearchInput'

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

export default function EventForm({
  theme,
  mode,
  setSaveModified,
  triggerOpen, 
  draftEvent,
  withLocation = true,
  withTask = true,
  withContact = true,
  initOpen, 
  taskList, 
  task, 
  setTask, 
  onSaveEventDetails, 
  onDeleteEvent}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const disableDone = location === '' || contact === '' || task === null
    
  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
      setLocation(draftEvent.location)
      setContact(draftEvent.contact)
      setComment(draftEvent.comment)
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  }, [triggerOpen, initOpen])

  const onChangeLocation = location => {
    setLocation(location)
  }

  const onChangeContact = event => {
    setContact(event.target.value)
  }

  const handleSaveEventDetails = () => {
    if (!withContact && !withLocation && !withTask)
      onSaveEventDetails(comment)
    else
      onSaveEventDetails(task ? task.name : '', location, contact, comment)

    if (mode === 'edit')
      setSaveModified(true)

    setOpen(false)
  }

  const handleDeleteEvent = () => {
    onDeleteEvent()
    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        {mode !== 'view' &&
          <div className={classes.container}>
            <div className={classes.grow} />
            <CreateIcon color='primary' fontSize='large'/>
            <div className={classes.grow} />
          </div>}
        <DialogContent>
          {withLocation && 
            <LocationSearchInput
              disabled={mode === 'view'}
              address={location} 
              changeAddr={onChangeLocation}
            />}
          {withContact &&
            <TextField
              disabled={mode === 'view'}
              id='contact'
              defaultValue={contact}
              required
              margin="dense"
              label="contact"
              type="text"
              fullWidth
              variant="outlined"
              onChange={onChangeContact}
            />}
          {withTask && 
            <div className={classes.job}>
              <AddJobDescription
                disabled={mode === 'view'}
                options={taskList}
                id="task-list"
                label="Job description"
                placeholder="job description"
                setTag={setTask}
                tag={task}          
              />
            </div>}
          <TextField
            disabled={mode === 'view'}
            id="comment"
            label="Additional instructions"
            placeholder="Additional instructions"
            defaultValue={comment}
            multiline
            className={classes.textField}
            margin="dense"
            variant="outlined"
            onChange={(event) => setComment(event.target.value)}
          />          
        </DialogContent>
        {mode !== 'view' &&
          <DialogActions className={classes.button}>
            <Button variant="contained" onClick={handleDeleteEvent} color="primary" fullWidth>
              Delete
            </Button>
            <Button variant="contained" onClick={handleSaveEventDetails} color="primary" fullWidth disabled={disableDone}>
              Save
            </Button>
          </DialogActions>}        
      </Dialog>
    </>
  )
}