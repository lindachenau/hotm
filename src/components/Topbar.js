import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import { Link as MaterialLink, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import LinkIcon from '@material-ui/icons/Link'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockIcon from '@material-ui/icons/Lock'
import BusinessIcon from '@material-ui/icons/Business'
import BrushIcon from '@material-ui/icons/Brush'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import SearchIcon from '@material-ui/icons/Search'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import SigninForm from '../config/SigninFormContainer'
import SignoutForm from '../config/SignoutFormContainer'
import Filter from '../config/FilterContainer'
import CalendarLoader from '../components/CalendarLoader'
import { home_url } from '../config/dataLinks'

const logo = require('../images/hblc_logo_192_white_bg.png')

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'flex',
    alignItems: 'center'
  },
}))

const artistMenu = [
  {
    label: "Client auto booking",
    pathname: "/",
    icon: <AddIcon />
  },
  {
    label: "Client manual booking",
    pathname: "/manual",
    icon: <AddCircleOutlineIcon />
  },  
  {
    label: "Corporate booking",
    pathname: "/corporate",
    icon: <BusinessIcon />
  },
  {
    label: "Package booking",
    pathname: "/package",
    icon: <BusinessCenterIcon />
  },  
  {
    label: "Artist booking",
    pathname: "/artist",
    icon: <BrushIcon />
  },
  {
    label: "Manage bookings",
    pathname: "/manage",
    icon: <AssignmentIndIcon />
  },
  {
    label: "Checkout a completed job",
    pathname: "/checkout",
    icon: <AssignmentTurnedInIcon />
  },  
  {
    label: "Go to Hair on the Move",
    pathname: home_url,
    external: true,
    icon: <LinkIcon />
  }
];

const userMenu = [
  {
    label: "Client auto booking",
    pathname: "/",
    icon: <AddIcon />
  },
  {
    label: "Client manual booking",
    pathname: "/manual",
    icon: <AddCircleOutlineIcon />
  },  
  {
    label: "Go to Hair on the Move",
    pathname: home_url,
    external: true,
    icon: <LinkIcon />
  }
];

function Topbar ({location, bookingValue, loggedIn, isArtist, artists, setArtistSignedIn}) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [triggerSignin, setTriggerSignin] = useState(false)
  const [triggerSignout, setTriggerSignout] = useState(false)
  const [triggerFilter, setTriggerFilter] = useState(false)
  const currentPath = location.pathname
  const bookingPage = currentPath === '/' || currentPath === '/artist'
  const retrievalPage = currentPath === '/manage'
  const menu = isArtist ? artistMenu : userMenu
  
  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setDrawerOpen(open)
  }

  const handleUser = evt => {
    evt.preventDefault()
    if (loggedIn)
      setTriggerSignout(!triggerSignout)
    else
      setTriggerSignin(!triggerSignin)
  }

  const handleFilter = evt => {
    evt.preventDefault()
    setTriggerFilter(!triggerFilter)
  }

  let title

  switch (currentPath) {
    case '/manual':
      title = 'Client manual bookings'
      break    
    case '/manage':
      title = 'Manage bookings'
      break
    case '/artist':
      title = 'Artist booking'
      break
    case '/corporate':
      title = 'Corporate booking'
      break
    case '/package':
      title = 'Package booking'
      break
    case '/checkout':
        title = 'Checkout a completed job'
        break                              
    default:
      title = 'Client auto booking'
  }

  return (
    <div className={classes.grow}>
      <AppBar color="secondary" position='static'>
        <Toolbar>
          <Link to="/">
            <img width={60} src={logo} alt="Hair on the move logo" />
          </Link>
          <React.Fragment>
            <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <div className={classes.title}>
              <Typography variant='h6'>{ title }</Typography>
            </div>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <div
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {menu.map(item => (
                    <ListItem 
                      component={item.external ? MaterialLink : Link} 
                      href={item.external ? item.pathname : null} 
                      to={item.external ? null : {pathname: item.pathname, search: location.search}} 
                      button key={item.label}
                      target={item.external ? "_blank" : null}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </div>
            </Drawer>
            <span>&nbsp;</span>
            <span>{ `v${process.env.REACT_APP_VERSION}` }</span>
          </React.Fragment>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {bookingPage && 
            <React.Fragment>
              <AccountBalanceWalletIcon fontSize='small'/>
              <span>{ `$${bookingValue}` }</span>
            </React.Fragment>}
            {retrievalPage && 
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleFilter}
            >
              <SearchIcon/>
              <Typography variant='body1'>bookings</Typography>
            </IconButton>}
            <IconButton
              edge="end"
              color="default"
              onClick={handleUser}
            >
              {loggedIn ? <AccountCircleIcon color='primary'/> : <LockIcon style={{color: '#325f9c'}}/>}
            </IconButton>
          </div>
        </Toolbar>
        <SignoutForm triggerOpen={triggerSignout} /> 
        <SigninForm triggerOpen={triggerSignin} initOpen={false} />
        <Filter triggerOpen={triggerFilter} artists={artists} /> 
        <CalendarLoader setIsSignIn={setArtistSignedIn} />
      </AppBar>
    </div>
  )
}

export default withRouter(Topbar)
