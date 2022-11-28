const transformUsersToContacts = (contacts: any) =>
  contacts.reduce((acc: Array<any>, el: any) => {
    acc.push({
      id: el._id,
      username: el.username,
      email: el.email,
      online: el.online,
      avatar: el.avatar ?? '',
      lastSeen: el.lastSeen ?? ''
    })
    return acc
  }, [])

export default transformUsersToContacts
