import React, { useState, useEffect }  from 'react';
import SwipeableViews from 'react-swipeable-views'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign } from "react-icons/fa"
// import { FaEdit, FaTrashAlt, FaSignOutAlt } from "react-icons/fa"
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: '#e8e5e5'
  }
}));

function Card ({ event }) {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center" color="textPrimary">
          { moment(event.start).format("dddd, Do MMMM YYYY") }
        </Typography>
        <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
          { moment(event.start).format('LT') + ' – ' + moment(event.end).format('LT')}
        </Typography>
        <div>
          <FaMapMarkerAlt/><span>{ event.address }</span>
        </div>
        <div>
          <FaUserAlt/> 
          <span>{ event.client.name + ' ' }</span> 
          <FaPhoneSquare/>
          <span>{ event.client.phone + ' ' }</span>
        </div>
        <div>
          <br/>
          <FaDollarSign/>
          <span>{ event.total + ' '}</span>
          <span>{ event.artist.name}</span>
          <ul>
            {event.serviceItems.map( item => <li>{ item }</li> )}
          </ul>
        </div>
      </Paper>
    </Container>
  )
}

const slide = {
    minHeight: 100,
    height: '100%',
    marginTop: 20
}

const BookingCards = (props) => {
  const [index, setIndex] = useState(0)

  const handleChangeIndex = index => { setIndex(index) }

  return (
    <SwipeableViews index={index} onChangeIndex={handleChangeIndex} style={slide}>
      { props.events.map(event => <Card event={event} />) }
    </SwipeableViews>
  )
}

export default BookingCards