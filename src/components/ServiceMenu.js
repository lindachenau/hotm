import React from "react"
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import ServicePerCat from '../config/ServicePerCatContainer'

const ServiceMenu = ({
  theme,
  services,
  organic, 
  pensionerRate, 
  toggleOrganic, 
  togglePensionerRate, 
  skills=[],
  artistBooking }) => {
  
  const items = services.items
  const cats = services.cats
  const displayCat = (catId) => {
    if (skills.length === 0 || skills.includes(catId))
      return true
    else
      return false
  }
  
  return (
    <>
      <FormControlLabel
        control={
          <Switch checked={pensionerRate} onChange={() => togglePensionerRate()} value="pensionerRate" color="primary"/>
        }
        label="Monday pensioner rate (less 20%)"
      />
      <FormControlLabel
        control={
          <Switch checked={organic} onChange={() => toggleOrganic()} value="organic" color="primary"/>
        }
        label="Use organic products"
      />
      {cats.map( cat => 
        displayCat(cat.catId) && 
        <ServicePerCat
          theme={theme}
          items={items}
          key={cat.name}
          cat={cat} 
          organic={organic}
          pensioner={pensionerRate}
          artistBooking={artistBooking}
        />
      )}
    </>
  )
}

export default ServiceMenu