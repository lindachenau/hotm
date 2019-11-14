import generateData from "./generateData"
import { createArtists, createClients, createServices } from './dataFormatter'

const data = generateData()

export function getArtists()
{
  return createArtists(data.artists)
}

export function getClients()
{
  return createClients(data.clients)
}

export function getServices()
{
  return createServices(data.services)
}

export function getBookings()
{
  return data.bookings
}

export function getEvents(bookings, artists, clients, services)
{
  let events = []

  for (let booking of bookings) {
    let serviceItems = []
    let total = 0
    for (let j = 0; j < booking.items.length; j++) {
      //Don't know why services contain invalid id. The random id is constrained to a valid range.
      if (services[booking.items[j]]) {
        serviceItems.push(services[booking.items[j]].description + ' Qty ' + booking.quantity[j])
        total += services[booking.items[j]].price * booking.quantity[j]
      }
    }

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