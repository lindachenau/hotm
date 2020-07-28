import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import MyCalendar from '../components/MyCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import Button from '@material-ui/core/Button'

import AddArtists from '../components/AddArtists'
import AddCorporate from '../components/DropdownList'
import CorporateEventForm from '../components/CorporateEventForm'
import EventDrafts from '../components/EventDrafts'
import { mergeArrays } from '../utils/arrays'

const localizer = momentLocalizer(moment)

const useStyles = makeStyles(theme => ({
  padding: {
    paddingTop: 10
  },
  padding2: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 20
  },
  grow: {
    flexGrow: 1
  },
}))

function startDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 0, 0)).toISOString()
}
function endDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 23, 59)).toISOString()
}
const corporateList = [
  {
    name: "Virgin 1",
    location: "34 Burton Street, Darlinghurst NSW",
    contactPerson: "Mary Smith", 
    contactPhone: "0425 234 543"
  },
  {
    name: "Virgin 2",
    location: "225 George Street, Sydney NSW",
    contactPerson: "Katie Johnston", 
    contactPhone: "0425 234 886"
  },
  {
    name: "Dyson 1",
    location: "65 York Street, Sydney NSW",
    contactPerson: "Marianne Young", 
    contactPhone: "0428 234 543"
  },
  {
    name: "Dyson 2",
    location: "339 Sussex Street, Sydney NSW",
    contactPerson: "John Huston", 
    contactPhone: "0427 234 886"
  }    
]

const taskList = [
  {
    name: "blow dry"
  },
  {
    name: "hairstyling"
  },
  {
    name: "makeup"
  },
  {
    name: "hairstyling + makeup"
  },
  {
    name: "beauty"
  }        
]

const Corporate = ({theme, artists, artistSignedIn}) => {
  const classes = useStyles(theme)
  const [artist, setArtist] = useState(null)
  const [draftId, setDraftId] = useState(1)
  const [corporate, setCorporate] = useState(null)
  const [task, setTask] = useState(null)
  const [draftEvent, setDraftEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [draftEvents, setDraftEvents] = useState([])
  const [fromDate, setFromDate] = useState(new Date())
  const today = new Date()
  const [toDate, setToDate] = useState(new Date(today.setDate(today.getDate() + 7)))
  const calendarId = artist ? artist.email : null
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerSaveAllDrafts, setTriggerSaveAllDrafts] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await window.gapi.client.calendar.events.list({
          'calendarId': calendarId,
          'timeMin': startDate(fromDate),
          'timeMax': endDate(toDate),
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        })

        const artEvents = events.result.items.map((item) => {
          return {
            id: item.id,
            start: new Date(item.start.dateTime),
            end: new Date(item.end.dateTime),
            artistNames: artist.name,
            type: item.summary === 'HOTM Booking' ? 'hotm' : 'private'
          }
        })
        setEvents(artEvents)
      } catch (err) {
        console.log('Event fetch error: ', err)
      }
    }
    
    //Artist is signed in to Google Calendar & with a valid calendar
    if (artistSignedIn && calendarId) 
      fetchEvents()

  }, [calendarId, fromDate, toDate])

  useEffect(() => {
    if (draftEvent) {
      setEvents([draftEvent])
      setDraftEvents(mergeArrays([draftEvent], draftEvents))
    }
  }, [draftEvent])

  const onSelectEvent = (event) => {
    if (event.type !== 'draft')
      return
    setDraftEvent(event)
    setTriggerEventForm(!triggerEventForm)
  }

  const onSaveEventDetails = (task) => {
    setDraftEvent({...draftEvent, task})
  }

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {

    if (event.type !== 'draft')
      return

    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    setEvents([updatedEvent])
    setDraftEvents(mergeArrays([updatedEvent], draftEvents))
  }

  const resizeEvent = ({ event, start, end }) => {
    
    if (event.type !== 'draft')
      return

    setEvents([event])
    setDraftEvents(mergeArrays([event], draftEvents))
  }

  const newEvent = (event) => {

    //Disable adding new event in month view
    if (event.slots.length === 1)
      return

    const newId = `draft-${draftId}`
    setDraftId(draftId + 1)

    const newEvent = {
      id: newId,
      type: 'draft',
      title: 'New Event',
      allDay: false,
      start: event.start,
      end: event.end,
      artistNames: artist ? artist.name : ''
    }
    setEvents([newEvent])
    setDraftEvents(mergeArrays([newEvent], draftEvents))
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={2}>
          <AddCorporate
            options={corporateList}
            id="corporate-list"
            label="Corporate"
            placeholder="corporate"
            setTag={setCorporate}
            tag={corporate}
          />             
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="from-date"
              label="Select from date"
              value={fromDate}
              onChange={setFromDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="to-date"
              label="Select to date"
              value={toDate}
              onChange={setToDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <div className={classes.padding}>
            <AddArtists
              artists={artists}
              multiArtists={false}
              clearable={false}
              setTags={setArtist}
              tags={artist}
              label="Select artist"
            />
          </div>
          <div className={classes.padding}>
            <EventDrafts
              theme={theme}
              items={draftEvents}
            />
          </div>
          <div className={classes.padding2}>
            <div className={classes.grow} />
            <Button variant="contained" onClick={() => setTriggerSaveAllDrafts(!triggerSaveAllDrafts)} color="primary">
              Save all drafts
            </Button>
            <div className={classes.grow} />
          </div>          
        </Grid>
        <Grid item xs={12} md={10}>                     
          <MyCalendar
            events={events}
            localizer={localizer}
            artist={artist}
            onSelectEvent={onSelectEvent}
            moveEvent={moveEvent}
            resizeEvent={resizeEvent}
            newEvent={newEvent}
            triggerSaveAllDrafts={triggerSaveAllDrafts}
            triggerDeleteEvent={triggerDeleteEvent}
            eventToDelete={draftEvent? draftEvent.id : null}
          />
        </Grid>
      </Grid>
      <CorporateEventForm 
        theme={theme}
        triggerOpen={triggerEventForm}
        corporate={corporate}
        initOpen={false}
        taskList={taskList}
        task={task}
        setTask={setTask}
        onSaveEventDetails={onSaveEventDetails}
        onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
      />
    </Container>
  )
}

export default withRouter(Corporate)