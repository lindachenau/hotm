import React from "react";
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from '../components/Topbar';
import ArtistSelection from '../components/ArtistSelection'
import BookingSteps from '../components/BookingSteps'
import ServiceSelection from '../components/ServiceSelection'

const Booking = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);
 
  const currentPath = props.location.pathname
  const { services, artists, theme } = props

  return (
    <React.Fragment>
      <CssBaseline />
      <Topbar currentPath={currentPath}/>
      <BookingSteps activeStep={activeStep}/>
      {activeStep == 0 ? <ServiceSelection onSubmit={setActiveStep} services={services} theme={theme}/> : null}
      {activeStep == 1 ? <ArtistSelection onSelect={setActiveStep} artists={artists}/> : null}
    </React.Fragment>
  )
}

export default withRouter(Booking)
