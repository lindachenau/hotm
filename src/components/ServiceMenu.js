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

import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Badge from '@material-ui/core/Badge'


const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  background: {
    backgroundColor: '#f18383'
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


const quantityInit = list => {
  let qty = {}

  for (let i = 0; i < list.length; i++ ) {
    qty[list[i]] = 0
  }

  return qty
}

export default function ServiceMenu(props) {
  const { items, cat, organic, pensioner } = props
  const classes = useStyles();
  const [ listOpen, setListOpen ] = useState(false)
  const [ quantity, setQuantity ] = useState(quantityInit(cat.list))
  const [ totalItems, setTotalItems ] = useState(0)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }

  const handleIncrement = (id, prevQuantity) => setQuantity(() => {
    let copy = Object.assign({}, prevQuantity)
    copy[id] = copy[id] + 1;
    setTotalItems(totalItems+ 1)

    return copy
  })
 
  const handleDecrement = (id, prevQuantity) => setQuantity(() => {
    if (prevQuantity[id] > 0) {
      let copy = Object.assign({}, prevQuantity)
      copy[id] = copy[id] - 1;
      setTotalItems(totalItems - 1)

      return copy
    }
    else {
      return prevQuantity
    }
  })
  
  return (
    <Paper className={classes.paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead className={classes.background}>
          <TableRow>
            <TableCell align="left" style={{width: "60%"}}>
              {cat.name}
              <IconButton onClick={toggleListOpen} edge='start'>
                {listOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
              </IconButton>
            </TableCell>
            <TableCell align="right" style={{width: "30%", padding: 0}}>
              <div className={classes.priceField}>
                <AttachMoneyIcon fontSize="small" color="inherit"/>
              </div>
            </TableCell>
            <TableCell align="right" style={{width: "10%"}}>
              <IconButton color="inherit">
                <Badge badgeContent={totalItems} color="inherit" showZero>
                  <ShoppingCartIcon/>
                </Badge>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {listOpen ?
          <TableBody>
            {cat.list.map(id => (
              <TableRow key={items[id]}>
                <TableCell align="left" style={{width: "60%"}}>
                  {items[id].description}
                  <div className={classes.priceEmbedded}>
                    {' - $' + ((organic ? items[id].organic_price : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell align="right" style={{width: "30%", padding: 0}}>
                  <div className={classes.priceField}>
                    {((organic ? items[id].organic_price : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell align="right" style={{width: "10%"}}>
                  <ButtonGroup>
                    <Button 
                      variant="text" 
                      startIcon={<AddIcon fontSize="small"/>}
                      onClick={() => handleIncrement(id, quantity)}
                    >
                      {quantity[id]}
                    </Button>
                    <IconButton onClick={() => handleDecrement(id, quantity)}>
                      <RemoveIcon fontSize="small"/>
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          : null
        }
      </Table> 
    </Paper>
  )

}
