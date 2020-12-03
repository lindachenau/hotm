import React, { useState, useEffect, useContext } from "react"
import { withRouter } from 'react-router-dom'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import SimpleDropDown from '../components/SimpleDropDown'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    marginTop: 20,
    marginBottom: 10
  },
  button: {
    marginTop: 20
  }
}))

const CorpForm = ({form, setTag, addCorpCards, updateCorpCards}) => {
  const [corpName, setCorpName] = useState('')
  const [address, setAddress] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [hblcRate, setHblcRate] = useState('')
  const [therapistRate, setTherapistRate] = useState('')
  const [abn, setAbn] = useState('')
  const [disableSave, setDisableSave] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    if (corpName && address && contactPerson && contactEmail && contactPhone && hblcRate && therapistRate && abn)
      setDisableSave(false)
    else
      setDisableSave(true)
  },[corpName, address, contactPerson, contactEmail, contactPhone, hblcRate, therapistRate, abn])

  useEffect(() => {
    if (form) {
      setCorpName(form.name)
      setAddress(form.address)
      setContactPerson(form.contactPerson)
      setContactEmail(form.contactEmail)
      setContactPhone(form.contactPhone)
      setHblcRate(form.hblcRate)
      setTherapistRate(form.therapistRate)
      setAbn(form.abn)
    } else {
      setCorpName('')
      setAddress('')
      setContactPerson('')
      setContactEmail('')
      setContactPhone('')
      setHblcRate('')
      setTherapistRate('')
      setAbn('')
    }
  }, [form])

  const handleSave = async() => {
    let data = {
      corporate_name: corpName.trim(),
      event_address: address.trim(),
      contact_name: contactPerson.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      hotm_rate: hblcRate,
      artist_rate: therapistRate        
    }

    if (form) {
      data.id = form.id
      updateCorpCards(data, () => alert('The corporate card was updated successfully!'))
    }
    else {
      addCorpCards(data, () => alert('The new corporate card was created successfully!'))
    }

    setTag(null)
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            autoFocus
            required
            margin="dense"
            label="corporate name"
            type="text"
            fullWidth
            defaultValue={corpName}
            value={corpName}
            onChange={event => setCorpName(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            margin="dense"
            label="corporate address"
            type="text"
            fullWidth
            defaultValue={address}
            value={address}
            onChange={event => setAddress(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>        
          <TextField
            required
            margin="dense"
            label="contact person"
            type="text"
            fullWidth
            defaultValue={contactPerson}
            value={contactPerson}
            onChange={event => setContactPerson(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            margin="dense"
            label="contact email"
            type="email"
            fullWidth
            defaultValue={contactEmail}
            value={contactEmail}
            onChange={event => setContactEmail(event.target.value.trim())}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            margin="dense"
            label="contact phone"
            type="tel"
            fullWidth
            defaultValue={contactPhone}
            value={contactPhone}
            onChange={event => setContactPhone(event.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            margin="dense"
            label="HBLC rate"
            type="number"
            fullWidth
            defaultValue={hblcRate}
            value={hblcRate}
            onChange={event => setHblcRate(event.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            margin="dense"
            label="therapist rate"
            type="number"
            fullWidth
            defaultValue={therapistRate}
            value={therapistRate}
            onChange={event => setTherapistRate(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            margin="dense"
            label="ABN"
            type="text"
            fullWidth
            defaultValue={abn}
            value={abn}
            onChange={event => setAbn(event.target.value)}
          />
        </Grid>
      </Grid>
      <Button className={classes.button} variant="contained" onClick={handleSave} color="secondary" fullWidth disabled={disableSave}>
        Save
      </Button>
    </Paper>
  )
}

const TaskForm = ({form, setTag, addAdminTasks, updateAdminTasks}) => {
  const [taskName, setTaskName] = useState('')
  const classes = useStyles()

  useEffect(() => {
    if (form) {
      setTaskName(form.name)
    } else {
      setTaskName('')
    }
  }, [form])

  const handleSave = async() => {
    let data = { description: taskName.trim()}
    if (form) {
      data.id = form.id
      updateAdminTasks(data, () => alert('The task was updated successfully!'))
    } else {
      addAdminTasks(data, () => alert('The new task was created successfully!'))
    }

    setTag(null)
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <TextField
        autoFocus
        required
        margin="dense"
        label="task name"
        type="text"
        fullWidth
        defaultValue={taskName}
        value={taskName}
        onChange={event => setTaskName(event.target.value)}
      />
      <Button className={classes.button} variant="contained" onClick={handleSave} color="secondary" fullWidth disabled={taskName === ''}>
        Save
      </Button>
    </Paper>
  )
}

const Admin = ({ addCorpCards, updateCorpCards, addAdminTasks, updateAdminTasks }) => {
  const { corpCards, adminTasks } = useContext(BookingsStoreContext)
  const [tag, setTag] = useState(null)
  const [label, setLabel] = useState('Choose corporate')
  const [placeholder, setPlaceholder] = useState('Corporate')
  const [formType, setFormType] = useState('corporate')
  const [list, setList] = useState(corpCards)
  const [form, setForm] = useState(null)

  useEffect(() => {
    setTag(null)
    setPlaceholder(formType === 'corporate' ? 'Corporate Card' : 'Therapist Task')
    setLabel(formType === 'corporate' ? 'Choose corporate card' : 'Choose therapist task')
    setList(formType === 'corporate' ? corpCards : adminTasks)
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [formType, corpCards, adminTasks])

  useEffect(() => {
    if (tag === null)
      return

    if (formType === 'corporate') {
      if (tag.id) {
        setForm({
          id: parseInt(tag.id),
          name: tag.name,
          address: tag.address.trim(),
          contactPerson: tag.contactPerson.trim(),
          contactEmail: tag.contactEmail,
          contactPhone: tag.contactPhone.trim(),
          hblcRate: tag.hblcRate,
          therapistRate: tag.therapistRate,
          abn: '123456789'
        })
      } else {
        setForm(null)
      }
    } else {
      if (tag.id) {
        setForm({
          id: tag.id,
          name: tag.name
        })
      } else {
        setForm(null)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [tag])

  return (
    <Container maxWidth="sm" style={{paddingTop: 40, paddingBottom: 20}}>
      <Typography variant="h5" align="center" gutterBottom color="textPrimary">
        Please choose the form type for edit
      </Typography>      
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="form-type" 
          name="form-type" 
          value={formType} 
          onChange={(event) => setFormType(event.target.value)}
        >
          <FormControlLabel value="corporate" control={<Radio color="primary"/>} label="Corporate card" />
          <FormControlLabel value="task" control={<Radio color="primary"/>} label="Therapist task" />
        </RadioGroup>
      </FormControl>
      <SimpleDropDown
        list={list}
        setTag={setTag}
        tag={tag}
        label={label}
        placeholder={placeholder}
      />
      {formType === 'corporate' && tag && 
        <CorpForm 
          form={form} 
          setTag={setTag}
          addCorpCards={addCorpCards}
          updateCorpCards={updateCorpCards}
        />
      }
      {formType === 'task' && tag && 
        <TaskForm 
          form={form} 
          setTag={setTag}
          addAdminTasks={addAdminTasks}
          updateAdminTasks={updateAdminTasks}
        />
      }
    </Container>
  )
}

export default withRouter(Admin)
