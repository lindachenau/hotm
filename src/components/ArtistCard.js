import React, { Component } from 'react'
import withStyles from '@material-ui/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'


const styles = theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    height: 300,
    [theme.breakpoints.down('sm')]: {
      height: 450
    }
  },
  avatar: {
    width: 100,
    height: 100
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      alignItems: 'center'
    }
  }
})

class CardItem extends Component { 
  render() {
    const { classes, avatar, name, bio, title } = this.props

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} className={classes.flex}>
            <Avatar alt="" src={ avatar } className={classes.avatar}/>
          </Grid>
          <Grid item xs={12} md={9}>
            <div className={classes.itemContainer}>
              <Typography variant="h5" gutterBottom>
                { name }
              </Typography>
              <Typography gutterBottom>
                { bio }
              </Typography>
              <Typography variant="h6" gutterBottom>
                { title }
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default withStyles(styles)(CardItem)
