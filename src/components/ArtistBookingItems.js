import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  background: {
    backgroundColor: theme.palette.primary.main
  },
  foreground: {
    color: 'white'
  }
}))

export default function ArtistBookingItems({ theme, items, duration }) {
  const classes = useStyles(theme)
  const [ listOpen, setListOpen ] = useState(true)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }
  
  return (
    <Paper className={classes.paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.background}>
          <TableRow>
            <TableCell align="left" className={classes.foreground}>
              {`Service items (estimated duration : ${duration} mins)`}
              <IconButton onClick={toggleListOpen} edge='start' color='inherit'>
                {listOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {listOpen ?
          <>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell align="left">
                    {`${item.description} x ${item.qty}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
          : null
        }
      </Table> 
    </Paper>
  )
}
