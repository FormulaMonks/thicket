import localforage from 'localforage'

export const get = (key) =>
  localforage.getItem(`${key}`)
    .then(res => res || undefined)
    .catch(err => {
      console.warn(`There was an error retrieving item (${key}) from localstorage: ${err}`)
      return undefined
    })

export const set = (key, state) =>
  localforage.setItem(`${key}`, state)
    .catch(err =>
      console.warn(`There was an error setting item (${key}) to localstorage ${err}`))
