import generateData from "./generateData"
import { normaliseArtists, normaliseClients, normaliseServices } from './dataFormatter'


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

