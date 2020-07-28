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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import PhoneEnabledIcon from '@material-ui/icons/PhoneEnabled'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'

import ContactInfo from './ContactInfo'

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  background: {
    backgroundColor: theme.palette.primary.main
  }
}))

export default function EventDrafts({ theme, items }) {
  const classes = useStyles(theme)
  const [ listOpen, setListOpen ] = useState(false)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }
  
  const totalHrs = () => {
    let total = 0
    items.forEach((item) => {
      total = total + (item.end - item.start)
    })

    return (total / 3600000).toFixed(1)
  }

  return (
    <Paper className={classes.paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.background}>
          <TableRow>
            <TableCell align="left">
              {`Drafts : ${totalHrs(items)} hrs`}
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
                    {`${moment(item.start).format("YYYY/MM/DD")} - ${((item.end - item.start) / 3600000).toFixed(1)} hrs : ${item.artistNames} - ${item.task}`}
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
