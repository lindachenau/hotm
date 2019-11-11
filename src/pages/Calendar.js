import React from 'react';
import { withRouter } from 'react-router-dom';
import MyCalendar from '../components/MyCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Container from '@material-ui/core/Container'

const localizer = momentLocalizer(moment)

const Calendar = (props) => {

  return (
    <React.Fragment>
      <Container maxWidth="xl" style={{padding: 10}}>
        <MyCalendar
          events={props.events}
          localizer={localizer} 
        />
      </Container>
    </React.Fragment>
  )
}

export default withRouter(Calendar)
