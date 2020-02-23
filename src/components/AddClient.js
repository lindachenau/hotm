import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { user_url, access_token } from '../config/dataLinks'
import axios from "axios"

export default function AddClient({client, setClient, label}) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState(client !== null ? [client] : [])
  const [searchKey, setSearchKey] = useState('')
  const active = open && searchKey.length >= 3
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (active && !loading) {
      (async () => {

        const config = {
          method: 'get',
          headers: { 'Authorization': access_token },
          url: `${user_url}?search=${searchKey}`
        }

        setLoading(true)
        let clients = await axios(config)
        // console.log(searchKey, clients.data)
        setOptions(clients.data.map(client => {
          return {
            id: client.id,
            name: client.name, 
            phone: client.meta.billing_phone[0]
          }
        }))
        setLoading(false)

      })()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])


  const handleChangeClient = (event, value) => {
    setClient(value)
  }

  const handleChangeSearchKey = (event, value, reason) => {
    if (reason === 'input')
      setSearchKey(value)
    else if (reason === 'clear')
      setSearchKey('')
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSearchKey('')
    setOptions([])
  }

  const getOptionLabel = option => {
    return `${option.name} - ${option.phone}`
  }

  return (
    <Autocomplete
      id="asynchronous-client"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      value={client}
      onChange={handleChangeClient}
      onInputChange={handleChangeSearchKey}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
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