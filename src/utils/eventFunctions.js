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

export const onSaveEventDetails = (task, address, contact, comment, draftEvent, setDraftEvent) => {
  setDraftEvent({...draftEvent, task: task, address, contact, comment})
}

export const moveEvent = (event, start, end, setEvents, draftEvents, setDraftEvents) => {

  if (event.type !== 'draft')
    return

  const updatedEvent = { ...event, start, end, allDay: false }

  setEvents([updatedEvent])
  setDraftEvents(mergeThenSort([updatedEvent], draftEvents))
}

export const resizeEvent = (event, start, end, setEvents, draftEvents, setDraftEvents) => {
  console.log(start, end)
  if (event.type !== 'draft' || start >= end)
    return

  const resized = {...event, start, end}
  setEvents([resized])
  setDraftEvents(mergeThenSort([resized], draftEvents))
}

export const onNavigate = (date, view, fromDate, setFromDate, toDate, setToDate, setToday) => {
  setToday(date)
  if (view === 'month') {
    const start = moment(date).startOf('month').startOf('week')._d
    const end = moment(date).endOf('month').endOf('week')._d
    if (start < fromDate)
      setFromDate(start)
    if (end > toDate)
      setToDate(end)      
  }

  if (view === 'day') {
    if (date < fromDate)
      setFromDate(date)
    if (date > toDate)
      setToDate(date)      
  }
}