import React, { useState } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer } from "mdbreact"
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button' 
import EventAvailableIcon from '@material-ui/icons/EventAvailable'
import EventIcon from '@material-ui/icons/Event'

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
      height: '500px',
      width: '500px',
      position: 'absolute',
      left: '50%', 
      top: '50%',
      marginLeft: '-250px',
      marginTop: '-250px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column'
    },
    button: {
      margin: theme.spacing(1)
    }
  }))

  const classes = useStyles()

  return (
    <>
      {!location ?
      <MDBContainer>
        <MDBCarousel activeItem={1} length={3} showControls={false} showIndicators={false} className="z-depth-1" slide>
          <MDBCarouselInner>
            {imgList.map( image => 
              <MDBCarouselItem itemId={image.key} key={image.key} alt={image.alt}>
                <MDBView>
                  <img className="d-block w-100" src={image.name} />
                  <MDBMask overlay="white-light" />
                </MDBView>
              </MDBCarouselItem>
            )}
          </MDBCarouselInner>
        </MDBCarousel>
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
      </MDBContainer>
      :
      <Redirect to={location} />}
    </>
  )
}

export default withRouter(Home)
