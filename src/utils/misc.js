import { contact_phone } from '../config/dataLinks'

 //Merge arr2 into arr1; If item with the same id exists in arr1, the item in arr2 is dropped.
  export const mergeArrays = (arr1, arr2) => {
    let merged = []
    const arr = arr1.concat(arr2)
    let assoc = {}

    arr.forEach((item) => {
      const id = item.id
      if (!assoc[id]) {
        merged.push(item)
        assoc[id] = true
      }
    })

    return merged
  }

export function startDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 0, 0)).toISOString()
}

export function endDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 23, 59)).toISOString()
}

const legalBookingTime = (bookingTime) => {
  const now = new Date()
  const ahead24hrs = (bookingTime - now) / 3600000 >= 24 
  const bookingHour = bookingTime.getHours()
  const between8And18 = bookingHour >= 8 && bookingHour < 18

  return ahead24hrs && between8And18
}

export const checkBookingRules = (pensionerRate, bookingTime) => {
  if (pensionerRate && bookingTime.getDay() !== 1) {
    alert('Sorry, pensioner rate is only available on Mondays.')
    return false
  }
  
  if (!legalBookingTime(bookingTime)) {
    alert(`Please book appointments between 8am to 6pm at least 24 hours in advance. If you need to book outside these hours, please call ${contact_phone}.`)
    return false
  }

  return true
}