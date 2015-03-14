import firebase from '../lib/firebase'
import { toArray } from '../lib/utils'

import { DRAG_Z_INDEX } from '../lib/constants'

export default {
  maxZIndex,
  nextZIndex,
}

var fire = firebase.getRef().child('notes')
var notes = []

fire.on('value', (snapshot) => {
  notes = toArray(snapshot.val())
})

function maxZIndex() {
  return notes.reduce((prevMax, note) => {
    if (note.zIndex === DRAG_Z_INDEX)
      return prevMax
    else
      return Math.max(prevMax, note.zIndex)
  }, 0)
}

function nextZIndex() {
  return maxZIndex() + 1
}