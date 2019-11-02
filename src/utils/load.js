const services_url = 'http://localhost:4000/services'
const artists_url = 'http://localhost:4000/artists'
const clients_url = 'http://localhost:4000/clients'
const bookings_url = 'http://localhost:4000/bookings'

export function getArtists()
{
  let artists = {}
  
  fetch(artists_url)
  .then(res => res.json())
  .then(json => json.map(artist => 
    artists[artist.id] = {
      name: artist.name,
      avatar: artist.avatar,
      profile: artist.profile
    }
  ))
  
  return artists
}

export function getClients()
{
  let clients = {}
  
  fetch(clients_url)
  .then(res => res.json())
  .then(json => json.map(client => 
    clients[client.id] = {
      name: client.name,
      phone: client.phone
    }
  ))

  return clients
}

export function getServices()
{
  let services = {}
  
  fetch(services_url)
  .then(res => res.json())
  .then(json => json.map(service => 
    services[service.id] = {
      description: service.description,
      price: service.price
    }
  ))

  return services
}


export function getBookings(artists, clients, services)
{
  let bookings = []
  
  fetch(bookings_url)
  .then(res => res.json())
  .then(json => json.map(booking => {
    let serviceItems = []
    let total = 0
    for (let i = 0; i < booking.items.length; i++) {
      serviceItems.push(services[booking.items[i]].description + ' Qty ' + booking.quantity[i])
      total += services[booking.items[i]].price * booking.quantity[i]
    }
    
    bookings.push({
      id: booking.id,
      start: new Date(booking.start),
      end: new Date(booking.end),
      address: booking.address,
      artist: artists[booking.artist],
      client: clients[booking.client],
      serviceItems: serviceItems,
      total: total
    })}
  ))

  return bookings
}