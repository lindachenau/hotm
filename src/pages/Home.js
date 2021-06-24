import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AddArtists from '../components/AddArtists'
import { Typography } from '@material-ui/core'
import logo from '../images/HBLC-logo-600.png'

const Home = ({ theme, artists }) => {
  const [location, setLocation] =useState('')
  const [therapist, setTherapist] = useState(null)
  const anyTherapist = {
    id: 0,
    state: '',
    name: 'ANY THERAPIST',
    email: ''
  }
  const therapistDropdown = Object.assign({}, artists, {"0": anyTherapist})

  const useStyles = makeStyles(theme => ({
    heading: {
      display: 'flex',
      marginTop: 10,
      marginBottom: 20
    },
    grow: {
      flexGrow: 1
    },
    logo: {
      width: 250,
      height: 250,
      [theme.breakpoints.down('sm')]: {
        maxWidth: '50%',
        maxHeight: 180
      }
    },
    title: {
      marginBottom: 40
    }
  }))

  const classes = useStyles()

  useEffect(() => {
    if (therapist) {
      if (therapist.id === 0) {
        setLocation({
          pathname: '/any-therapist'
        })
      } else {
        setLocation({
          pathname: '/choose-therapist',
          therapist: therapist
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [therapist])

  return (
    <>
      {!location ?
      <div>
        <Container maxWidth='sm'>
          <div className={classes.heading}>
            <div className={classes.grow} />
            <img className={classes.logo} src={logo} alt="Hair Beauty Life Co logo" />
            <div className={classes.grow} />
          </div>
          <Typography className={classes.title} variant="h5" align="center" color="textPrimary">
            Please Choose your preferred therapist
          </Typography>
          <AddArtists
            artists={therapistDropdown}
            multiArtists={false}
            clearable={false}
            setTags={setTherapist}
            tags={therapist}
            label="Choose therapist"
          />
        </Container>                           
      </div>
      :
      <Redirect to={location} />}
    </>
  )
}

export default withRouter(Home)
