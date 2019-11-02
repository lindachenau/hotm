import React,  { Component } from 'react'
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

const logo = require('../images/logo192.png');

const Menu = [
  {
    label: "Add a booking",
    pathname: "/",
    icon: <AddIcon />
  },
  {
    label: "Account management",
    pathname: "/account",
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


class Topbar extends Component {

  state = { drawerOpen: false }

  toggleDrawerOpen = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen })
  }

  closeDrawer = () => {
    this.setState({ drawerOpen: false })
  }

  render() {

    const { currentPath } = this.props

    let title

    switch (currentPath) {
      case '/calendar':
        title = 'Booking calendar'
        break
      case '/account':
        title = 'Account management'
        break
      default:
        title = 'Add a booking'
    }

    return (
      <AppBar color="secondary" position='static'>
        <Toolbar>
          <img width={60} src={logo} alt="" />
          <React.Fragment>
            <IconButton onClick={this.toggleDrawerOpen} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant='h5'>
              { title }
            </Typography>
            <Drawer anchor="left" open={this.state.drawerOpen} onClose={this.closeDrawer}>
              <List>
                {Menu.map(item => (
                  <ListItem 
                    component={item.external ? MaterialLink : Link} 
                    href={item.external ? item.pathname : null} 
                    to={item.external ? null : {pathname: item.pathname, search: this.props.location.search}} 
                    button key={item.label}
                    target={item.external ? "_blank" : null}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </React.Fragment>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Topbar)
