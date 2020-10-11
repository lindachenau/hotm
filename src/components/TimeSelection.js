import React, { useState, useEffect } from 'react'
import TheCalendar from './TheCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import InfoIcon from '@material-ui/icons/Info'
import CheckIcon from '@material-ui/icons/Check'
import HelpIcon from '@material-ui/icons/Help'
import Button from '@material-ui/core/Button'
import EventManager from './EventManager'
import { onSelectEvent, resizeEvent, moveEvent, onNavigate } from '../utils/eventFunctions'

const localizer = momentLocalizer(moment)

const TimeSelection = ({changeBookingStage, theme}) => {
  const useStyles = makeStyles(theme => ({
    flex: {
      display: 'flex',
      marginTop: 10
    },
    grow: {
      flexGrow: 1,
    }
  }))
  
  const [events, setEvents] = useState([])
  const classes = useStyles()
  /*
   * today is passed to date prop of DragAndDropCalendar which is used as current date to open the calendar.
   * We initialise today to 'today' in booking creation and the first event date in booking editing.
   * today will be updated whenever onNavigate is called so that Calendar can track date correctly.
  */
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const calendarId = 'sootyyu@gmail.com'
  
  useEffect(() => {
    setFromDate(moment(today).startOf('month').startOf('week')._d)
    setToDate(moment(today).endOf('month').endOf('week')._d)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  const handleNext = () => {
    changeBookingStage(2)
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={3}>
          <List component="nav">
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary={`Your appointment requires 100 minutes. Therapist travel time is automatically calculated.`} />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Find available time from the therapist's calendar to book your appointment. 
                  Once you decide a date, click the date number icon to go to the Day view. Select your start time from the Day view. An event 
                  including the therapist travel time and your appointment time will be generated automatically." />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="The event must start after 8am, finish before 6pm and not overlap with the therapist's existing events." />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="If conflict, move the event by dragging or open the event edit box to change start time." />
            </ListItem>            
          </List>
          <div className={classes.flex}>
            <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(0)}>
              back
            </Button>
            <div className={classes.grow} />
            <Button variant="text" color="primary" size='large' onClick={handleNext}>
              Next
            </Button>
          </div>          
        </Grid>
        <Grid item xs={12} md={9}>
          <TheCalendar
            events={events}
            localizer={localizer}
            defaultDate={today}
            onSelectEvent={(event) => onSelectEvent(event, null, [], null, null, null)}
            moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, [], null)}
            resizeEvent={({event, start, end}) => resizeEvent(event, start, end, setEvents, [], null)}
            newEvent={null}
            onNavigate={(date, view) => onNavigate(date, view, fromDate, setFromDate, toDate, setToDate, setToday)}
            triggerSaveAllDrafts={null}
            triggerDeleteEvent={null}
            eventToDelete={null}
          />
        </Grid>
      </Grid>  
      <EventManager
        mode={null}
        saveModified={null}
        setSaveModified={null}
        artistSignedIn={true}
        artist={null}
        calendarId={calendarId}
        fromDate={fromDate}
        toDate={toDate}
        setEvents={setEvents}
        draftEvent={null}
        draftEvents={[]}
        setDraftEvents={null}     
        triggerDeleteEvent={null}
      />
    </Container>
  )
}

export default TimeSelection