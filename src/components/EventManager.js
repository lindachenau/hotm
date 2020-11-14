import { useEffect } from 'react'
import { startDate, endDate } from '../utils/misc'
import { mergeThenSort } from '../utils/eventFunctions'
import { calendar_events_url } from '../config/dataLinks' 

const EventManager = ({
  mode,
  saveModified,
  setSaveModified,
  artistSignedIn,
  artist,
  offDays=[],
  calendarId, 
  fromDate,
  toDate,
  setEvents,
  draftEvent,
  draftEvents,
  setDraftEvents,
  triggerDeleteEvent,
  therapistBooking=false
}) => {
  
  useEffect(() => {
    const getOffDays = (start, end) => {
      if (offDays.length === 0)
        return []

      let offDayList = []

      let curTick = new Date(start).getTime()
      const numDays = Math.ceil((new Date(end).getTime() - curTick) / 86400000)

      for (let i = 0; i < numDays; i++) {
        const date = new Date(curTick)
        const y = date.getFullYear()
        const m = date.getMonth()
        const d = date.getDate()
        if (offDays.includes(date.getDay())) {
          offDayList.push({
            id: date.toISOString(), //make the inserted event unique
            start: new Date(y, m, d, 8, 0), //8am
            end: new Date(y, m, d, 18, 0), //6pm
            artistName: artist ? artist.name : '',
            artistId: artist ? artist.id : '',
            address: '',
            type: 'private'
          })
        }
        curTick = curTick + 86400000
      }

      return offDayList
    }
  
    const fetchEvents = async () => {
      try {
        const start = startDate(fromDate)
        const end = endDate(toDate)
        const events = await window.gapi.client.calendar.events.list({
          'calendarId': calendarId,
          'timeMin': start,
          'timeMax': end,
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        })

        const artEvents = events.result.items.map((item) => {
          return {
            id: item.id,
            start: new Date(item.start.dateTime),
            end: new Date(item.end.dateTime),
            artistName: artist ? artist.name : '',
            artistId: artist ? artist.id : '',
            address: item.location ? item.location : '',
            type: item.summary === 'HOTM Booking' ? 'hotm' : 'private'
          }
        })
        const offDays = getOffDays(start, end)
        setEvents(mergeThenSort(artEvents, offDays))
      } catch (err) {
        const errMessage = err.result.error.message
        alert(`Event fetch error: ${errMessage}`)
        console.log('Event fetch error: ', errMessage)
      }
    }

    const fetchEventsViaBackend = async () => {
      try {
        const url = `${calendar_events_url}?artist_email=${calendarId}&start_date=${startDate(fromDate).substring(0, 10)}&end_date=${endDate(toDate).substring(0, 10)}`
        const data = await fetch(url)
        const events = await data.json()
        const start = startDate(fromDate)
        const end = endDate(toDate)

        const artEvents = events.map((item) => {
          return {
            id: item.gcal_event_id.slice(0, 26),
            start: new Date(item.start_time),
            end: new Date(item.end_time),
            artistName: artist ? artist.name : '',
            artistId: artist ? artist.id : '',
            address: item.location ? item.location : '',
            type: item.summary === 'HOTM Booking' ? 'hotm' : 'private'
          }
        })
        const offDays = getOffDays(start, end)
        setEvents(mergeThenSort(artEvents, offDays))
      } catch (err) {
        console.log(err)
      }
    }

    //Artist is signed in to Google Calendar & with a valid calendar
    if (calendarId && fromDate && toDate) {
      if (artistSignedIn)
        fetchEvents()
      else
        fetchEventsViaBackend()
    }
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarId, fromDate, toDate])
  

  useEffect(() => {
    if (draftEvent && (mode === 'book' || saveModified)) {
      setEvents([draftEvent])
      setDraftEvents(mergeThenSort([draftEvent], draftEvents))
      setSaveModified(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftEvent])

  useEffect(() => {
    if (draftEvent === null)
      return
      
    if (mode === 'book') {
      const events = draftEvents.filter(event => event.id !== draftEvent.id)
      setDraftEvents(events)
    } else {
      draftEvent.toBeDeleted = true
      if (draftEvents.length > 0) {
        if (therapistBooking) //Therapist booking is a single event booking. Just remove it.
          setDraftEvents([])
        else
          setDraftEvents(mergeThenSort([draftEvent], draftEvents))
      } else {
        setDraftEvents([draftEvent])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDeleteEvent])

  return null
}

export default EventManager