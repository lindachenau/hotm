import { useEffect } from 'react'
import { startDate, endDate } from '../utils/misc'
import { mergeThenSort } from '../utils/eventFunctions'

const EventManager = ({
  mode,
  saveModified,
  setSaveModified,
  artistSignedIn,
  artist,
  calendarId, 
  fromDate,
  toDate,
  setEvents,
  draftEvent,
  draftEvents,
  setDraftEvents,
  triggerDeleteEvent
}) => {
  
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
            artistName: artist.name,
            artistId: artist.id,
            type: item.summary === 'HOTM Booking' ? 'hotm' : 'private'
          }
        })
        setEvents(artEvents)
      } catch (err) {
        const errMessage = err.result.error.message
        alert(`Event fetch error: ${errMessage}`)
        console.log('Event fetch error: ', errMessage)
      }
    }
    
    //Artist is signed in to Google Calendar & with a valid calendar
    if (artistSignedIn && calendarId) 
      fetchEvents()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarId, fromDate, toDate])
  

  useEffect(() => {
    if (draftEvent && (mode === 'book' || (mode === 'edit' && saveModified))) {
      setEvents([draftEvent])
      setDraftEvents(mergeThenSort([draftEvent], draftEvents))
      setSaveModified(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftEvent])

  useEffect(() => {
    if (mode === 'book') {
      const events = draftEvents.filter(event => event.id !== draftEvent.id)
      setDraftEvents(events)
    } else {
      if (draftEvents.length > 0) {
        let eventList = []
        draftEvents.forEach(event => {
          const entry = Object.assign({}, event)
          if (entry.id === draftEvent.id)
            entry.toBeDeleted = true
          eventList.push(entry)
        })
        setDraftEvents(eventList)
      } else {
        draftEvent.toBeDeleted = true
        setDraftEvents([draftEvent])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDeleteEvent])

  return null
}

export default EventManager