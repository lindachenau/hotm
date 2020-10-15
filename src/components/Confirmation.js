import React, { useState } from 'react'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import { term_url } from '../config/dataLinks'


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    width: '100%',
    overflowX: 'auto'
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
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
  },
  acknowledge: {
    display: 'flex',
    marginTop: 20,
    alignItems: 'flexStart'
  },
  inline: {
    display: 'inline',
    paddingTop: 0
  }
}))

function Confirmation ({ 
  bookingDate, 
  bookingEnd, 
  bookingAddr, 
  artistId, 
  items, 
  itemQty, 
  changeBookingStage, 
  organic, 
  pensioner, 
  bookingValue, 
  artists, 
  therapistId, 
  chooseTherapist=false }) {
  const [checkedDeposit, setCheckedDeposit] = useState(false)
  const [checkedTerm, setCheckedTerm] = useState(false)
  const [checkedParking, setCheckedParking] = useState(false)
  const id = chooseTherapist ? therapistId : artistId
  const classes = useStyles()

  const handleDeposit = event => {
    setCheckedDeposit(!checkedDeposit)
  }

  const handleTerm = event => {
    setCheckedTerm(!checkedTerm)
  }

  const handleParking = event => {
    setCheckedParking(!checkedParking)
  }

  let ids = Object.keys(itemQty)

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <Paper className={classes.paper}>
        <Typography variant="subtitle1" align="center" color="textPrimary">
          { moment(bookingDate).format("dddd, Do MMMM YYYY") }
        </Typography>
        <Typography variant="subtitle1" align="center" color="textPrimary" gutterBottom>
          { `${moment(bookingDate).format('LT')} – ${moment(bookingEnd).format('LT')}` }
        </Typography>
        <Table size="small" aria-label="a dense table">
          <TableHead className={classes.background}>
            <TableRow>
              <TableCell align="left" style={{width: "70%"}} className={classes.foreground}>
                <b>Booking location</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">
                {bookingAddr}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/>
        <Table size="small" aria-label="a dense table">
          <TableHead className={classes.background}>
            <TableRow>
              <TableCell align="left" style={{width: "70%"}} className={classes.foreground}>
                <b>Selected artist</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="left">
              {artists[id].name}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br/>
        <Table size="small" aria-label="a dense table">
          <TableHead className={classes.background}>
            <TableRow>
              <TableCell align="left" style={{width: "70%"}} className={classes.foreground}>
                <b>Services requested</b>
              </TableCell>
              <TableCell align="right" style={{width: "20%", padding: 0}} className={classes.foreground}>
                <div className={classes.priceField}>
                <b>Unit price</b>
                </div>
              </TableCell>
              <TableCell align="right" style={{width: "10%"}} className={classes.foreground}>
              <b>Qty</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map(id => (
              <TableRow key={id}>
                <TableCell align="left" style={{width: "70%"}}>
                  {items[id].description}
                  <div className={classes.priceEmbedded}>
                    { ` - $${((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}` }
                  </div>
                </TableCell>
                <TableCell align="right" style={{width: "20%", padding: 0}}>
                  <div className={classes.priceField}>
                    { `$${((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}` }
                  </div>
                </TableCell>
                <TableCell align="right" style={{width: "10%"}}>
                  {itemQty[id]} 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pensioner ? <Chip deleteIcon={<DoneIcon/>} onDelete={()=> {}} label="Monday pensioner rate" color='primary' size="small"/> : null}
        {organic ? <Chip deleteIcon={<DoneIcon/>} onDelete={()=> {}} label="Use organic products" color='primary' size="small"/> : null}
        <hr></hr>
        <Typography variant="subtitle2" align="right" color="textPrimary">
          { `TOTAL (GST INCL): $${bookingValue}` }
        </Typography>
        <div className={classes.acknowledge}>
          <Checkbox checked={checkedDeposit} onChange={handleDeposit} value="checkedDeposit" className={classes.inline}/>
          <Typography variant="body2" align="left" color="textPrimary">
            Please pay 30% of the requested services to secure your booking now.
          </Typography>
        </div>
        <div className={classes.acknowledge}>
          <Checkbox checked={checkedTerm} onChange={handleTerm} value="checkedTerm" className={classes.inline}/>
          <Typography variant="body2" align="left" color="textPrimary">
            Please read and accept our &nbsp;
          </Typography>
          <Link target="_blank" href={term_url} rel="noopener">
            Terms & Conditions.
          </Link>
        </div>
        <div className={classes.acknowledge}>
          <Checkbox checked={checkedParking} onChange={handleParking} value="checkedTerm" className={classes.inline}/>
          <Typography variant="body2" align="left" color="textPrimary">
            Customers are required to pay parking charges incurred while artists attend your booking. 
            The incurred parking charges will be added onto the final invoice. Parking instructions can be provided 
            inside the "Additional instructions" box in the "Pay deposit" step.
          </Typography>
        </div>
      </Paper>
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(1)}>
          back
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(3)} 
          disabled={!checkedDeposit || !checkedTerm || !checkedParking}
        >
          confirm booking
        </Button>
      </div>
    </Container>
  )
}

export default Confirmation