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
  },
  foreground: {
    color: 'white'
  },  
  priceField: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    }
  },
  priceEmbedded: {
    display: 'inline',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  }
}))

export default function ServicePerCat({ theme, items, cat, organic, pensioner, itemQty, incItemQty, decItemQty, artistBooking }) {
  const classes = useStyles(theme)
  const [ listOpen, setListOpen ] = useState(false)
  const [triggerContact, setTriggerContact] = useState(false)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }

  const totalItems = (cat, itemQty) => {
    let total = 0
    for (let id of cat.list) {
      total += (itemQty[id] ? itemQty[id] : 0)
    }
    return total
  }

  const handlePhone = evt => {
    evt.preventDefault()
    setTriggerContact(!triggerContact)
  }

  return (
    <Paper className={classes.paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.background}>
          <TableRow>
            <TableCell align="left" style={{width: "60%"}} className={classes.foreground}>
              {cat.name.toUpperCase()}
              <IconButton onClick={toggleListOpen} edge='start' color="inherit">
                {listOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
              </IconButton>
            </TableCell>
            <TableCell align="right" style={{width: "30%", padding: 0}} className={classes.foreground}>
              <div className={classes.priceField}>
                <AttachMoneyIcon fontSize="small" color="inherit"/>
              </div>
            </TableCell>
            <TableCell align="right" style={{width: "10%"}} className={classes.foreground}>
              <IconButton color="inherit">
                <Badge badgeContent={totalItems(cat, itemQty)} showZero>
                  <ShoppingCartIcon/>
                </Badge>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {listOpen ?
          <>
            <TableBody>
              {cat.list.map(id => (
                <TableRow key={id}>
                  <TableCell align="left" style={{width: "60%"}}>
                    {items[id].description}
                    <div className={classes.priceEmbedded}>
                      { ` - $${((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}` }
                    </div>
                  </TableCell>
                  <TableCell align="right" style={{width: "30%", padding: 0}}>
                    <div className={classes.priceField}>
                      {((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}
                    </div>
                  </TableCell>
                  {items[id].onlineBooking || artistBooking ?
                    <TableCell align="right" style={{width: "10%"}}>
                      <ButtonGroup>
                        <Button 
                          variant="text" 
                          startIcon={<AddIcon fontSize="small"/>}
                          onClick={() => incItemQty(id)}
                        >
                          {itemQty[id] ? itemQty[id] : 0} 
                        </Button>
                        <IconButton onClick={() => decItemQty(id)}>
                          <RemoveIcon fontSize="small"/>
                        </IconButton>
                      </ButtonGroup>
                    </TableCell>
                    : 
                    <TableCell align="center" style={{width: "10%"}}>
                      <IconButton onClick={handlePhone}>
                        <PhoneEnabledIcon/>
                      </IconButton>
                    </TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>
            {artistBooking ? null : <ContactInfo triggerOpen={triggerContact}/>}
          </>
          : null
        }
      </Table> 
    </Paper>
  )
}
