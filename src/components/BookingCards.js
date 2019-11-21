import React, { useState, useEffect }  from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign } from "react-icons/fa"
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)"
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  }
}));

function Card ({ event }) {
  const classes = useStyles();

  return (
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
  )
}


const BookingCards = ({events, eventsFetched}) => {
  const classes = useStyles()

  const [activeStep, setActiveStep] = useState(0)
  const [maxSteps, setMaxSteps] = useState(0)

  useEffect(() => {
    setMaxSteps(events.length)
  }, [eventsFetched])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    events.length > 0 ?
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <Card event={events[activeStep]} />
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next event
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Prev event
          </Button>
        }
      />
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large'>
          Edit
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large'>
          Delete
        </Button>
      </div>
    </Container>
    :
    <Container maxWidth="sm" style={{paddingTop: 20}}>
      <Typography variant="h6" align="center" color="textPrimary">No booking found</Typography>
    </Container>
  )
}

export default BookingCards