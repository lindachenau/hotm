import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function AddArtists({tags, setTags, multiArtists, clearable, disabled=false, artists, label}) {

  const artistOptions = Object.values(artists).sort((a, b) => {
    let artists1 = a.state.toUpperCase() + a.name + a.email
    let artists2 = b.state.toUpperCase() + b.name + b.email
    if (artists1 < artists2)
      return -1
    else if (artists1 > artists2)
      return 1
    else
      return 0
  })

  const onChangeArtists = (event, value) => {
    setTags(value)
  }

  const dropdownDisplay = (option) => {
    const ext = option.email ?  ` - ${option.email}` : ''
    return `${option.name}${ext}`
  }

  return (
    <Autocomplete
      multiple={multiArtists}
      id="artist-list"
      disabled={disabled}
      disableClearable={clearable}
      filterSelectedOptions
      options={artistOptions}
      groupBy={option => option.state.toUpperCase()}
      getOptionLabel={dropdownDisplay}
      value={tags}
      onChange={onChangeArtists}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Therapist name"
          label={label}
          fullWidth
        />
      )}
    />
  )
}