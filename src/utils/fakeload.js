import generateData from "./generateData"
import { normaliseArtists, normaliseClients, normaliseServices } from './dataFormatter'
import { getBookingValue } from './getBookingValue'


const data = generateData()

export function getArtists()
{
  return normaliseArtists(data.artists)
}

export function getClients()
{
  return normaliseClients(data.clients)
}

export function getServices()
{
  return normaliseServices(data.services)
}

export function getBookings()
{
  return data.bookings
}

export function getEvents(bookings, artists, clients, servicesMenu)
{
  let events = []

  for (const id in bookings) {
    let serviceItems = []
    let total = 0
    let booking = bookings[id]
    let itemQty = {}
    let priceFactors = {
      organic: booking.with_organic,
      pensionerRate: booking.with_pensioner_rate
    }
    for (let j = 0; j < booking.services.length; j++) {
      //Don't know why services contain invalid id. The random id is constrained to a valid range.
      if (servicesMenu[booking.services[j]]) {
        serviceItems.push(servicesMenu[booking.services[j]].description + ' Qty ' + booking.quantities[j])
        itemQty[booking.services[j]] = booking.quantities[j]
      }
    }

    total = getBookingValue(servicesMenu, priceFactors, itemQty)
    
    events.push({
      id: booking.id,
      start: new Date(booking.booking_date + 'T' + booking.booking_time + 'Z'),
      end: new Date(booking.booking_date + 'T' + booking.booking_end_time + 'Z'),
      address: booking.event_address,
      artist: artists[booking.artist_id],
      client: clients[booking.client_id],
      serviceItems: serviceItems,
      total: total
    })
  }

  return events
}