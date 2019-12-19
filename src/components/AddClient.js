import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { user_url, access_token } from '../config/dataLinks'
import axios from "axios"

export default function AddClient({setClientId}) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [client, setClient] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const active = open && searchKey.length >= 3
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (loading) 
      return

    if (active) {
      (async () => {

        const config = {
          method: 'get',
          headers: { 'Authorization': access_token },
          url: user_url + '?search=' + searchKey
        }

        setLoading(true)
        let clients = await axios(config)

        setOptions(clients.data)
        setLoading(false)

      })()
    }

  }, [searchKey, loading, active])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  const handleChangeClient = (event, value) => {
    setClient(value)
    setClientId(value.id)
  }

  const handleChangeSearchKey = (event) => {
    setSearchKey(event.target.value)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSearchKey('')
  }

  const getOptionLabel = option => {
    // console.log(option.meta)
    return option.name
  }

  return (
    <Autocomplete
      id="asynchronous-client"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      value={client}
      onChange={handleChangeClient}
      renderInput={params => (
        <TextField
          {...params}
          onChange={handleChangeSearchKey}
          label="Add client"
          fullWidth
          variant="outlined"
          placeholder="Client name or username"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}