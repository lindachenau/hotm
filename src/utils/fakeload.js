import generateData from "./generateData";

const data = generateData()

export function getArtists(n=0)
{
  let artists = {}
  let num = n && n < data.artists.length ? n : data.artists.length;
  
  for (let i = 0; i < num; i++ ) {
    artists[data.artists[i].id] = {
      name: data.artists[i].name,
      avatar: data.artists[i].avatar,
      skill: data.artists[i].skill,
      profile: data.artists[i].profile
    }
  }
  
  return artists
}

export function getClients(n=0)
{
  let clients = {}
  let num = n && n < data.clients.length ? n : data.clients.length;
  
  for (let i = 0; i < num; i++ ) {
    clients[data.clients[i].id] = {
      name: data.clients[i].name,
      phone: data.clients[i].phone
    }
  }

  return clients
}

export function getServices()
{
  let services = {}
  let cats = []
  
  for (let i = 0; i < data.services.length; i++ ) {
    let items = Object.values(data.services[i].data)
    let list = []
    for (let j = 0; j < items.length; j++ ) {
      list.push(items[j].id)
      services[items[j].id] = {
        cat: i,
        description: items[j].description,
        price: items[j].sale_price,
        organic_price: items[j].organic_add_price,
        time_on_site: items[j].time_on_site
      }
    }
    cats.push({
      "name": data.services[i].cat,
      "list": list
    })
  }
  return { 
    "items": services, 
    "cats": cats
  }
}

export function getBookings(artists, clients, services, n=10)
{
  let bookings = []
  let num = n && n < data.bookings.length ? n : data.bookings.length;

  for (let i = 0; i < num; i++ ) {
    let booking = data.bookings[i]
    let serviceItems = []
    let total = 0
    for (let j = 0; j < booking.items.length; j++) {
      //Don't know why services contain invalid id. The random id is constrained to a valid range.
      if (services[booking.items[j]]) {
        serviceItems.push(services[booking.items[j]].description + ' Qty ' + booking.quantity[j])
        total += services[booking.items[j]].price * booking.quantity[j]
      }
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
    })
  }

  return bookings
}