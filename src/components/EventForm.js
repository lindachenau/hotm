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
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'

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
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const disableDone = address === '' || contact === '' || task === null
  const [selectedDate, setSelectedDate] = useState(null)
    
  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
      setAddress(draftEvent.address)
      setContact(draftEvent.contact)
      setComment(draftEvent.comment)
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [triggerOpen, initOpen])

  const onChangeLocation = address => {
    setAddress(address)
  }

  const onChangeContact = event => {
    setContact(event.target.value)
  }

  const handleSaveEventDetails = () => {
    if (!withContact && !withLocation && !withTask)
      onSaveEventDetails(" ", " ", " ", comment)
    else
      onSaveEventDetails(task ? task.name : '', address, contact, comment)

    if (mode === 'edit')
      setSaveModified(true)

    setOpen(false)
  }

  const handleDeleteEvent = () => {
    onDeleteEvent()
    setOpen(false)
  }

  const handleDateChange = date => {
    setSelectedDate(date);
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Select booking date"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker"
              label="Select travel start time"
              value={selectedDate}
              minutesStep={10}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker"
              label="Select booking start time"
              value={selectedDate}
              minutesStep={10}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker"
              label="Select booking end time"
              value={selectedDate}
              minutesStep={10}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />                        
          </MuiPickersUtilsProvider>          
          {withLocation && 
            <LocationSearchInput
              disabled={mode === 'view'}
              address={address} 
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
            <Button variant="contained" onClick={handleDeleteEvent} color="secondary" fullWidth>
              Delete
            </Button>
            <Button variant="contained" onClick={handleSaveEventDetails} color="secondary" fullWidth disabled={disableDone}>
              Save
            </Button>
          </DialogActions>}        
      </Dialog>
    </>
  )
}