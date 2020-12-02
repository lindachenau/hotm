import React, { useState, useEffect, useReducer } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { clients_url } from '../config/dataLinks'
import useDebounce from '../utils/useDebounce'
import axios from "axios"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false
      }
    default:
      throw new Error()
  }
}

export default function AddClient({client, setClient, label, disabled=false}) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState(client !== null ? [client] : [])
  const [searchKey, setSearchKey] = useState('')
  const debouncedSearchKey = useDebounce(searchKey, 500)
  const active = open && searchKey.length >= 3
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    data: []
  })
  const { isLoading, data }  = state

  useEffect(() => {

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      const config = {
        method: 'get',
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: clients_url + '?name=' + searchKey
      }
 
      try {
        let result = await axios(config)
        dispatch({ type: "FETCH_SUCCESS", payload: result.data })
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE" })
        console.log("Client search error")
      }
    }

    if (active) {
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [debouncedSearchKey])

  useEffect(() => {
    setOptions(data.map(client => {
      return {
        id: client.id,
        name: client.name, 
        phone: client.phone,
        email: client.email,
        address: client.address
      }
    }))
  }, [data])

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
    setOptions([])
  }

  const getOptionLabel = option => {
    return `${option.name} - ${option.phone}`
  }

  return (
    <Autocomplete
      disabled={disabled}
      id="asynchronous-client"
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={isLoading}
      value={client}
      onChange={handleChangeClient}
      onInputChange={handleChangeSearchKey}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          fullWidth
          variant="outlined"
          placeholder="Client name or email"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}