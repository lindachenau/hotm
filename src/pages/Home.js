import React, { useState } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button' 
import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import EventIcon from '@material-ui/icons/Event'
import Carousel from 'react-material-ui-carousel'

const imgList = [
  {
    name: require("../images/wallpaper1.jpg"),
    key: "1",
    alt: "First slide"
  },
  {
    name: require("../images/wallpaper2.jpg"),
    key: "2",
    alt: "Second slide"
  },
  {
    name: require("../images/wallpaper3.jpg"),
    key: "3",
    alt: "Third slide"
  }
]

const Home = ({ theme }) => {
  const [location, setLocation] =useState('')
  const useStyles = makeStyles(theme => ({
    container: {
      width: '30vw',
      height: '30vh',
      marginLeft: '-15vw',
      marginTop: '-15vh',
      [theme.breakpoints.down('sm')]: {
        width: '100vw',
        marginLeft: '-50vw'
      },           
      position: 'absolute',
      left: '50%', 
      top: '50%',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around'
    },
    image: {
      maxWidth: '100%',
      height: 'auto'
    }
  }))

  const classes = useStyles()

  return (
    <>
      {!location ?
      <div>
        <Carousel indicators={false}>
          {
            imgList.map(image => <img className={classes.image} src={image.name} key={image.key} alt={image.alt}/>)
          }
        </Carousel>
        <Container className={classes.container}>
          <Button 
            variant="contained" 
            color="secondary"
            size='large'
            startIcon={<EventIcon />}
            onClick={() => setLocation({pathname: '/any-therapist'})}
            className={classes.button}
          >
            Any Therapist at your chosen time
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            size='large'
            startIcon={<EventAvailableIcon />}
            onClick={() => setLocation({pathname: '/choose-therapist'})}
            className={classes.button}
          >
            Choose Therapist to find available time
          </Button>
        </Container>                           
      </div>
      :
      <Redirect to={location} />}
    </>
  )
}

export default withRouter(Home)
