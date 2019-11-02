import React from "react";
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from '../components/Topbar';
import BookingCards from '../components/BookingCards'


const Account = (props) => {
  const currentPath = props.location.pathname
  return (
    <React.Fragment>
      <CssBaseline />
      <Topbar currentPath={currentPath}/>
      <BookingCards events={props.events}/>
    </React.Fragment>
  )
}

export default withRouter(Account)
