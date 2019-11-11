//import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import Booking from '../pages/Booking'
import Calendar from '../pages/Calendar'
import Manage from '../pages/Manage'
import Account from '../pages/Account'
import ScrollToTop from '../components/ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from '../components/Topbar'
import { getEvents } from '../utils/fakeload'


/**
 * For deploy testing frontend without backend
 */
const Routes = ({ theme, services, artists, clients, bookings, bookingStage, changeBookingStage, bookingValue, packageBooking }) => {
  const [events] = useState(getEvents(bookings, artists, clients, services.items))

  return (
    <HashRouter>
      <ScrollToTop>
        <CssBaseline />
        <Topbar bookingValue={bookingValue}/>
        <Switch>
          <Route exact path='/' render={() => 
            <Booking 
              theme={theme} 
              services={services} 
              bookingStage={bookingStage} 
              changeBookingStage={changeBookingStage} 
              bookingValue={bookingValue}
              packageBooking={packageBooking}/>} 
            />
          <Route path='/manage' render={() => <Manage events={events} />} />
          <Route path='/calendar' render={() => <Calendar events={events} />} />
          <Route path='/account' render={() => <Account/>} />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes