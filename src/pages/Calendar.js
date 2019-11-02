import React from 'react';
import { withRouter } from 'react-router-dom';
import MyCalendar from '../components/MyCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from '../components/Topbar'
import Container from '@material-ui/core/Container'

const localizer = momentLocalizer(moment)

const Calendar = (props) => {

  const currentPath = props.location.pathname

  return (
    <React.Fragment>
      <CssBaseline />
      <Topbar currentPath={currentPath}/>
      <Container maxWidth="xl" style={{padding: 10}}>
        <MyCalendar
          events={props.events}
          localizer={localizer} 
        />
      </Container>
    </React.Fragment>
  )
}

export default withRouter(Calendar);
