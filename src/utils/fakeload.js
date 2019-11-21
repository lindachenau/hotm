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

export function getEvents(bookings, artists, clients, services)
{
  let events = []

  for (const id in bookings) {
    let serviceItems = []
    let total = 0
    let booking = bookings[id]
    let itemQty = {}
    let priceFactors = {
      organic: booking.organic,
      pensionerRate: booking.pensionerRate
    }
    for (let j = 0; j < booking.items.length; j++) {
      //Don't know why services contain invalid id. The random id is constrained to a valid range.
      if (services[booking.items[j]]) {
        serviceItems.push(services[booking.items[j]].description + ' Qty ' + booking.quantity[j])
        itemQty[booking.items[j]] = booking.quantity[j]
      }
    }

    total = getBookingValue(services, priceFactors, itemQty)
    
    events.push({
      id: booking.id,
      start: new Date(booking.start),
      end: new Date(booking.end),
      address: booking.address,
      artist: artists[booking.artist],
      client: clients[booking.client],
      serviceItems: serviceItems,
      total: total
    })
  }

  return events
}