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
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import EventIcon from '@material-ui/icons/Event'
import LinkIcon from '@material-ui/icons/Link'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Badge from '@material-ui/core/Badge'

import MoreIcon from '@material-ui/icons/MoreVert'

const logo = require('../images/logo192.png');

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
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

const Menu = [
  {
    label: "Add a booking",
    pathname: "/",
    icon: <AddIcon />
  },
  {
    label: "Manage bookings",
    pathname: "/manage",
    icon: <AccountBoxIcon />
  },
  {
    label: "Booking calendar",
    pathname: "/calendar",
    icon: <EventIcon />
  },
  {
    label: "Go to Hair on the Move",
    pathname: "https://haironthemove2u.com.au",
    external: true,
    icon: <LinkIcon />
  }

];

function Topbar (props) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen ] = useState(false)
  const currentPath = props.location.pathname

  const toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setDrawerOpen(open)
  }

  let title

  switch (currentPath) {
    case '/calendar':
      title = 'Booking calendar'
      break
    case '/manage':
      title = 'Manage bookings'
      break
    default:
      title = 'Add a booking'
  }

  return (
    <div className={classes.grow}>
      <AppBar color="secondary" position='static'>
        <Toolbar>
          <img width={60} src={logo} alt="Hair on the move logo" />
          <React.Fragment>
            <IconButton onClick={toggleDrawer(true)} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant='h6'>
              { title }
            </Typography>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <div
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {Menu.map(item => (
                    <ListItem 
                      component={item.external ? MaterialLink : Link} 
                      href={item.external ? item.pathname : null} 
                      to={item.external ? null : {pathname: item.pathname, search: props.location.search}} 
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
          </React.Fragment>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit">
              <Badge max={10000} badgeContent={2000} color="primary">
                <AccountBalanceWalletIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
            >
              <AccountCircleIcon color='primary'/>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withRouter(Topbar)
