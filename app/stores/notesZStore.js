import firebase from '../lib/firebase'
import { toArray } from '../lib/utils'

export default {
  maxZIndex
}

var fire = firebase.getRef().child('notes')
var notes = []

fire.on('value', (snapshot) => {
  notes = toArray(snapshot.val())
})

function maxZIndex() {
  return notes.reduce((prevMax, note) => {
    return Math.max(prevMax, note.zIndex)
  }, 0)
}