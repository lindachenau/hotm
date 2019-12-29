import React, { useState, useEffect } from "react"
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
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import AddClient from './AddClient'

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

function AddPeople ({ 
  saveBooking,
  assignedArtists, 
  clientInfo,
  assignArtists,
  bookingDate, 
  bookingEnd, 
  bookingAddr, 
  items, 
  itemQty, 
  changeBookingStage, 
  organic, 
  pensioner, 
  bookingValue, 
  depositPayable,
  newBooking,
  artists }) {

  const client = clientInfo.client
  const [tags, setTags] = useState(assignedArtists.map(id => artists[id]))
  const classes = useStyles()
  const [disableNext, setDisableNext] = useState(true)
  const [clientId, setClientId] = useState(client !== null ? client.id : null)
  
  const artistOptions = Object.values(artists).sort((a, b) => {
    let artists1 = a.state.toUpperCase() + a.name
    let artists2 = b.state.toUpperCase() + b.name
    if (artists1 < artists2)
      return -1
    else if (artists1 > artists2)
      return 1
    else
      return 0
  })

  useEffect(() => {
    if (tags.length > 0)
      setDisableNext(false)
    else
      setDisableNext(true)
  }, [tags])
  
  const ids = Object.keys(itemQty)

  const handleBack = () => {
    assignArtists(tags.map(tag => tag.id))
    changeBookingStage(0)
  }

  const handleNext = () => {
    assignArtists(tags.map(tag => tag.id))

    const start_time = moment(bookingDate).format("HH:mm")
    const bookingData = {
      artist_id_list: tags.map(tag => tag.id),
      booking_date: moment(bookingDate).format("YYYY-MM-DD"),
      booking_time: start_time,
      booking_end_time: moment(bookingEnd).format("HH:mm"),
      artist_start_time: start_time,
      booking_id: null,
      created_datetime: null,
      event_address: bookingAddr,
      quantities: Object.values(itemQty),
      services: Object.keys(itemQty),
      unit_prices: Object.keys(itemQty).map(id => items[id].price),
      status: null,
      time_on_site: (bookingEnd - bookingDate) / 1000 / 60,
      travel_distance: 0,
      travel_duration: 0,
      client_id: clientId,
      with_organic: organic ? 1 : 0,
      with_pensioner_rate: pensioner ? 1 : 0,
      paid_balance_total: null,
      paid_deposit_total: null,
      total_amount: bookingValue, 
      paid_amount: newBooking? depositPayable : clientInfo.balance, 
      paid_type: newBooking ? 'deposit' : 'balance', 
      comment: '',
      status: ''
    }
  
    saveBooking(bookingData)
    changeBookingStage(2)
  }

  const onChangeArtists = (event, value) => {
    setTags(value)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <Paper className={classes.paper}>
        <Typography variant="subtitle1" align="center" color="textPrimary">
          { moment(bookingDate).format("dddd, Do MMMM YYYY") }
        </Typography>
        <Typography variant="subtitle1" align="center" color="textPrimary" gutterBottom>
          { moment(bookingDate).format('LT') + ' – ' + moment(bookingEnd).format('LT')}
        </Typography>
        <Table size="small" aria-label="a dense table">
          <TableHead className={classes.background}>
            <TableRow>
              <TableCell align="left" style={{width: "70%"}}>
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
        <Autocomplete
          multiple
          id="artist-list"
          disableClearable
          filterSelectedOptions
          options={artistOptions}
          groupBy={option => option.state.toUpperCase()}
          // getOptionLabel={option => option.state.toUpperCase() + ' - ' + option.name}
          getOptionLabel={option => option.name}
          value={tags}
          onChange={onChangeArtists}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Artist name"
              label="Add artists"
              fullWidth
            />
          )}
        />
        <br/>
        <AddClient
          setClientId={setClientId}
          client={client}
        />
        <br/>
        <Table size="small" aria-label="a dense table">
          <TableHead className={classes.background}>
            <TableRow>
              <TableCell align="left" style={{width: "70%"}}>
                <b>Services requested</b>
              </TableCell>
              <TableCell align="right" style={{width: "20%", padding: 0}}>
                <div className={classes.priceField}>
                <b>Unit price</b>
                </div>
              </TableCell>
              <TableCell align="right" style={{width: "10%"}}>
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
                    {' - $' + ((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell align="right" style={{width: "20%", padding: 0}}>
                  <div className={classes.priceField}>
                    {'$' + ((organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1)).toFixed(2)}
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
          {'TOTAL (GST INCL): $' + bookingValue}
        </Typography>
      </Paper>
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={handleBack}>
          back
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={handleNext} 
          disabled={disableNext}
        >
          confirm booking
        </Button>
      </div>
    </Container>
  )
}

export default AddPeople