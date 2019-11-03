import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1'
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  background: {
    backgroundColor: '#f18383'
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
  const { items, cat } = props
  const classes = useStyles();
  const [ listOpen, setListOpen ] = useState(false)
  const [ quantity, setQuantity ] = useState(quantityInit(cat.list))
  const [ total, setTotal ] = useState(0)

  const toggleListOpen = (e) => { setListOpen(!listOpen) }

  const handleIncrement = (id, prevQuantity) => setQuantity(() => {
    let copy = Object.assign({}, prevQuantity)
    copy[id] = copy[id] + 1;
    setTotal(total+ 1)

    return copy
  })
 
  const handleDecrement = (id, prevQuantity) => setQuantity(() => {
    if (prevQuantity[id] > 0) {
      let copy = Object.assign({}, prevQuantity)
      copy[id] = copy[id] - 1;
      setTotal(total - 1)

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
            <TableCell align="left" style={{width: "80%"}}>
              <Typography align="left" variant="p" display="inline">{cat.name}</Typography>
               <IconButton onClick= {toggleListOpen}>
                 {listOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
               </IconButton>
            </TableCell>
            <TableCell align="right" style={{width: "10%"}}>
              <AttachMoneyIcon fontSize="small"/>
            </TableCell>
            <TableCell align="right" style={{width: "10%"}}>
              <Button 
                variant="text" 
                startIcon={<ShoppingCartIcon fontSize="small"/>}
              >
                {total}
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        {listOpen ?
          <TableBody>
            {cat.list.map(id => (
              <TableRow key={items[id]}>
                <TableCell align="left" style={{width: "80%"}}>{items[id].description}</TableCell>
                <TableCell align="right" style={{width: "10%"}}>{items[id].price}</TableCell>
                <TableCell align="right" style={{width: "10%"}}>
                  <ButtonGroup>
                    <Button 
                      variant="text" 
                      endIcon={<ExposurePlus1Icon fontSize="small"/>}
                      onClick={() => handleIncrement(id, quantity)}
                    >
                      {quantity[id]}
                    </Button>
                    <IconButton onClick={() => handleDecrement(id, quantity)}>
                      <ExposureNeg1Icon fontSize="small"/>
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
