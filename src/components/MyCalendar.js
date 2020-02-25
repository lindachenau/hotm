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

  render() {
    return (
      <DragAndDropCalendar
        style={{height: '95vh', width: '100%', margin: 'auto'}}
        popup={true}
        localizer={this.props.localizer}
        events={this.props.events}
        components={components}
        resizable
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