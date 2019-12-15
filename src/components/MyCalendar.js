import React from 'react'
import { MonthEvent, DayEvent } from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { FaCalendarAlt, FaCalendarDay, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { GoTasklist } from "react-icons/go"

const DragAndDropCalendar = withDragAndDrop(Calendar)


const components = {
  month: {event: MonthEvent},
  day: {event: DayEvent}
}

class MyCalendar extends React.Component {

  // moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
  //   const { events } = this.state

  //   const idx = events.indexOf(event)
  //   let allDay = event.allDay

  //   if (!event.allDay && droppedOnAllDaySlot) {
  //     allDay = true
  //   } else if (event.allDay && !droppedOnAllDaySlot) {
  //     allDay = false
  //   }

  //   const updatedEvent = { ...event, start, end, allDay }

  //   const nextEvents = [...events]
  //   nextEvents.splice(idx, 1, updatedEvent)

  //   this.setState({ events: nextEvents })

  //   // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  // }

  // resizeEvent = ({ event, start, end }) => {
  //   const { events } = this.state

  //   const nextEvents = events.map(existingEvent => {
  //     return existingEvent.id === event.id
  //       ? { ...existingEvent, start, end }
  //       : existingEvent
  //   })

  //   this.setState({ events: nextEvents })

  //   //alert(`${event.title} was resized to ${start}-${end}`)
  // }

  // newEvent = ({ start, end }) => {
    
  //   const title = window.prompt('New Event name')
  //   if (title)
  //   {
  //     let num_es = this.state.numEvents + 1
  //     this.setState({
  //       events: [
  //         ...this.state.events,
  //         {
  //           id: num_es,
  //           start,
  //           end,
  //           title,
  //         },
  //       ],
  //       numEvents: num_es
  //     })
  //   }
  // }

  render() {
    return (
      <DragAndDropCalendar
        style={{height: '95vh', width: '100%', margin: 'auto'}}
        // selectable
        popup={true}
        localizer={this.props.localizer}
        events={this.props.events}
        components={components}
        // onEventDrop={this.moveEvent}
        resizable
        // onEventResize={this.resizeEvent}
        // onSelectSlot={this.newEvent}
        onDragStart={console.log}
        views={['month', 'day']}
        defaultView={Views.MONTH}
        defaultDate={new Date()}
        scrollToTime={new Date(2019, 1, 1, 6)}
        messages={{
          month: <FaCalendarAlt />, 
          day: <FaCalendarDay />,
          previous: <FaChevronLeft />,
          next: <FaChevronRight />,
          showMore: total => (
            <>
              {`+${total} `}
              <GoTasklist />
            </>
          ),
          noEventsInRange: 'There are no bookings in this range.'
        }}
      />
    )
  }
}

export default MyCalendar