import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function DropdownList({tag, setTag, disableClearable=false, disabled=false, options, id, label, placeholder}) {

  return (
    <Autocomplete
      id={id}
      filterSelectedOptions
      disableClearable={disableClearable}
      disabled={disabled}
      options={options}
      getOptionLabel={option => option.name}
      value={tag}
      onChange={(event, value) => {setTag(value)}}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={placeholder}
          label={label}
          fullWidth
        />
      )}
    />
  )
}