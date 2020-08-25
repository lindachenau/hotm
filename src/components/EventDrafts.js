import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import WarningIcon from '@material-ui/icons/Warning'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  background: {
    backgroundColor: theme.palette.primary.main
  }
}))

export default function EventDrafts({ theme, items, corporate }) {
  const classes = useStyles(theme)
  const [ listOpen, setListOpen ] = useState(true)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }
  
  const totalHrs = () => {
    let total = 0
    items.forEach((item) => {
      total = total + (item.end - item.start)
    })

    return (total / 3600000).toFixed(1)
  }

  const incompleteEvent = (item) => {
    return item.location === '' || item.contact === '' || item.task === '' || item.artistName === '' 
  }

  return (
    <Paper className={classes.paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.background}>
          <TableRow>
            <TableCell align="left">
              {corporate ? `Drafts : ${totalHrs(items)} hrs` : `Drafts`}
              <IconButton onClick={toggleListOpen} edge='start'>
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
                    {incompleteEvent(item) && <WarningIcon />}
                    {item.toBeDeleted && <DeleteForeverIcon />}
                    {corporate ? 
                      `${item.subject} - ${moment(item.start).format("YYYY/MM/DD")} - ${((item.end - item.start) / 3600000).toFixed(1)} hrs : ${item.artistName} - ${item.task}`
                      :
                      `${moment(item.start).format("YYYY/MM/DD")} : ${item.artistName} - ${item.task}`}
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
