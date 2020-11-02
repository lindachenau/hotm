import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function SimpleDropDown({tag, setTag, list, label, placeholder}) {
  const newItem = {
    id: 0,
    name: `Add New ${placeholder}`
  }
  const options = [newItem].concat(list)

  const onChange = (event, value) => {
    setTag(value)
  }

  return (
    <Autocomplete
      id="dropdown-list"
      disableClearable={true}
      filterSelectedOptions
      options={options}
      getOptionLabel={option => option.name}
      value={tag}
      onChange={onChange}
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