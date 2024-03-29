import React, { useState, useEffect, useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import TheCalendar from '../components/TheCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import { momentLocalizer } from 'react-big-calendar'
import '../components/CalendarToolbar.css'
import moment from 'moment'
import axios from "axios"
import Container from '@material-ui/core/Container'
import EventManager from '../components/EventManager'
import { onNavigate, onView } from '../utils/eventFunctions'
import { booking_events_url } from '../config/dataLinks' 
import { localDate, getEvents } from '../utils/dataFormatter'
import CheckoutForm from '../components/CheckoutForm'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import { getClientById } from '../utils/misc'

const localizer = momentLocalizer(moment)

const MyCalendar = ({theme, userEmail, artistSignedIn, updateBooking, artists, services, bookingEvent, setBookingEvent}) => {
  const { apiToken } = useContext(BookingsStoreContext)
  const [events, setEvents] = useState([])
  const [client, setClient] = useState({})
  /*
   * today is passed to date prop of DragAndDropCalendar which is used as current date to open the calendar.
   * We initialise today to 'today' in booking creation and the first event date in booking editing.
   * today will be updated whenever onNavigate is called so that Calendar can track date correctly.
  */
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [triggerCheckoutForm, setTriggerCheckoutForm] = useState(false)
  const [browsing, setBrowsing] = useState(true)
  const [location] = useState({
    pathname: '/therapist-booking',
    state: {checkout : true}
  })

  const calendarId = userEmail
  
  useEffect(() => {
    setFromDate(moment(today).startOf('week')._d)
    setToDate(moment(today).endOf('week')._d)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  useEffect(() => {
    // Client is fetched. Update the contact now in Checkout form.
    if (Object.keys(client).length) {
      const contact = `${client.name} ${client.phone}`
      setBookingEvent(Object.assign({}, bookingEvent, {
        client: client,
        contact: contact
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [client])

  const onSelectEvent = async (event) => {
    if (event.type !== 'hotm')
      return

    try {
      const url = `${booking_events_url}?gcal_event_id=${event.id.slice(0, 26)}`
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Authorization": `Bearer ${apiToken}`
        },
        url: url
      }

      const bookingEvent = (await axios(config)).data

      if (bookingEvent.admin_booking_id) { //Corporate or package bookings
        setBookingEvent({
          adminBooking: true,
          id: bookingEvent.admin_booking_id,
          eventId: bookingEvent.event_id,
          start: localDate(bookingEvent.booking_date, bookingEvent.booking_start_time),
          end: localDate(bookingEvent.booking_date, bookingEvent.booking_end_time),
          address: bookingEvent.event_location,
          task: bookingEvent.job_description,
          contact: bookingEvent.contact,
          comment: bookingEvent.comment,
          status: bookingEvent.status,
          actualStart: (bookingEvent.status === 'checkout' || bookingEvent.status === 'xero') ? localDate(bookingEvent.booking_date, bookingEvent.actual_start_time) : null,
          actualEnd: (bookingEvent.status === 'checkout' || bookingEvent.status === 'xero') ? localDate(bookingEvent.booking_date, bookingEvent.actual_end_time) : null
        })
        setTriggerCheckoutForm(!triggerCheckoutForm)
      } else {
        //Open the checkout form first before the client is fetched. Client query is very slow
        const events = getEvents([bookingEvent], artists, {}, services.items)
        const event = events[0]
        event.adminBooking = false
        event.contact = ''
        setBookingEvent(event)
        setTriggerCheckoutForm(!triggerCheckoutForm)
        const res = await getClientById(apiToken, bookingEvent.client_id)
        setClient(res.data)
      }
      
    } catch (err) {
      if (err.response) {
        console.log(err.response.data)
        const message = err.response.data.error
        alert(`${message} No booking event found. The booking has probably been cancelled.`)
      }
    }
  }

  return (
    <>
      {browsing ?
      <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
        <TheCalendar
          events={events}
          localizer={localizer}
          defaultDate={today}
          onSelectEvent={onSelectEvent}
          moveEvent={null}
          resizeEvent={null}
          newEvent={null}
          onNavigate={(date, view) => onNavigate(date, view, setFromDate, setToDate, setToday)}
          onView={(view) => onView(view, setFromDate, setToDate, today)}
          triggerSaveAllDrafts={null}
          triggerDeleteEvent={null}
          eventToDelete={null}
        />
        <EventManager
          mode={null}
          saveModified={null}
          setSaveModified={null}
          artistSignedIn={artistSignedIn}
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
        <CheckoutForm
          event={bookingEvent}
          triggerOpen={triggerCheckoutForm}
          updateBooking={updateBooking}
          setBrowsing={setBrowsing}
        />
      </Container>
      :
      <Redirect to={location} />}
    </>  
  )
}

export default withRouter(MyCalendar)