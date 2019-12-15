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
  artistId, 
  assignedArtists, 
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
  artists }) {

  const [tags, setTags] = useState(assignedArtists.map(id => artists[id]))
  const classes = useStyles()
  const [disableNext, setDisableNext] = useState(true)
  const artistOptions = Object.values(artists).sort((a, b) => {
    if (a.name < b.name)
      return -1
    else if (a.name > b.name)
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
    changeBookingStage(2)
  }

  /*
   * This is a workaround. For some reason, state (Tags) is always behind the update cycle while
   * assigning to a var (assignedArtists) happens in the same update cycle. It's like combinatorial
   * vs synchronous in digital circuit. Very strange!
   */
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