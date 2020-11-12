import { mergeArrays } from '../utils/misc'
import moment from 'moment'

export const mergeThenSort = (arr1, arr2) => {
  const events = mergeArrays(arr1, arr2).sort((a, b) => {
    let event1 = a.corporate + a.start.valueOf()
    let event2 = b.corporate + b.start.valueOf()
    if (event1 < event2)
      return -1
    else if (event1 > event2)
      return 1
    else
      return 0
  })

  return events
}

export const onSelectEvent = (event, setDraftEvent, adminTasks, setTask, triggerEventForm, setTriggerEventForm) => {
  if (event.type !== 'draft')
    return
  setDraftEvent(event)
  setTask(adminTasks.filter(task => task.name === event.task)[0])
  setTriggerEventForm(!triggerEventForm)
}

export const onSaveEventDetails = (task, address, contact, comment, start, bookingTime, end, draftEvent, setDraftEvent) => {
  if (task && address && contact)
    setDraftEvent({...draftEvent, task, address, contact, comment, start, bookingTime, end})
  else
    setDraftEvent({...draftEvent, comment, start, bookingTime, end})
}

export const moveEvent = (event, start, end, setEvents, draftEvents, setDraftEvents) => {

  if (event.type !== 'draft')
    return

  let updatedEvent
  if (event.bookingTime) {
    const shift =  start.getTime() - event.start.getTime()
    const bookingTime = new Date(event.bookingTime.getTime() + shift)
    updatedEvent = { ...event, start, bookingTime, end, allDay: false }
  } else {
    updatedEvent = { ...event, start, end, allDay: false }
  }

  setEvents([updatedEvent])
  setDraftEvents(mergeThenSort([updatedEvent], draftEvents))
}

export const resizeEvent = (event, start, end, setEvents, draftEvents, setDraftEvents) => {
  if (event.type !== 'draft' || start >= end)
    return

  let resized
  if (event.bookingTime && event.bookingTime < start) {
    const bookingTime = start
    resized = {...event, start, bookingTime, end}
  } else {
    resized = {...event, start, end}
  }
  
  setEvents([resized])
  setDraftEvents(mergeThenSort([resized], draftEvents))
}

export const onNavigate = (date, view, setFromDate, setToDate, setToday) => {
  setToday(date)
  if (view === 'month') {
    const start = moment(date).startOf('month').startOf('week')._d
    const end = moment(date).endOf('month').endOf('week')._d
    setFromDate(start)
    setToDate(end)      
  }

  if (view === 'week') {
    const start = moment(date).startOf('week')._d
    const end = moment(date).endOf('week')._d
    setFromDate(start)
    setToDate(end)      
  }

  if (view === 'day') {
    setFromDate(date)
    setToDate(date)      
  }
}

export const noEvents = (mode, adminBooking, draftEvents) => {
  if (draftEvents.length === 0)
    return true

  if (mode === 'book')  
    return false

  const bookingEvents = adminBooking ? adminBooking.eventList : []    
  let numEvents = bookingEvents.length
  for (const item of draftEvents) {
    if (item.toBeDeleted)
      numEvents = numEvents - 1
    else if (item.id.toString().includes('draft')) // Newly added events
      numEvents = numEvents + 1
  }

  return numEvents === 0
}
