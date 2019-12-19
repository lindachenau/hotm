export function normaliseArtists(artistArr)
{
  let artists = {}
  
  for (let i = 0; i < artistArr.length; i++ ) {
    artists[artistArr[i].id.toString()] = {
      id: artistArr[i].id,
      name: artistArr[i].name,
      photo: artistArr[i].photo,
      title: artistArr[i].title,
      bio: artistArr[i].bio,
      hashtag: artistArr[i].hashtag ? artistArr[i].hashtag.replace('#', '') : "haironthemove2u"
    }
  }
  
  return artists
}

export function normaliseClients(clientArr)
{
  let clients = {}
  
  for (let i = 0; i < clientArr.length; i++ ) {
    clients[clientArr[i].id.toString()] = {
      id: clientArr[i].id,
      name: clientArr[i].name,
      phone: clientArr[i].phone
    }
  }

  return clients
}

export function normaliseServices(serviceArr)
{
  let services = {}
  let cats = []
  
  for (let i = 0; i < serviceArr.length; i++ ) {
    let items = Object.values(serviceArr[i].data)
    let list = []
    for (let j = 0; j < items.length; j++ ) {
      let id = items[j].id.toString()
      list.push(id)
      services[id] = {
        cat: i,
        description: items[j].description,
        price: items[j].sale_price,
        organicPrice: items[j].organic_add_price,
        timeOnsite: items[j].time_on_site,
        onlineBooking: items[j].is_not_package === '1' ? true : false
      }
    }
    cats.push({
      "name": serviceArr[i].cat,
      "list": list
    })
  }
  return { 
    "items": services, 
    "cats": cats
  }
}

