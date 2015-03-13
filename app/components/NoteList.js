import React from 'react'
import fire from '../lib/firebase'
import { toArray } from '../lib/utils'

export default React.createClass({

  getInitialState() {
    return { notes: [] }
  },

  componentDidMount() {
    this.fire = fire.getRef().child('/notes')
    this.fire.on('value', this.updateMe)
  },

  componentWillUnmount() {
    this.file.off('value', this.updateMe)
  },

  updateMe(snapshot) {
    var notes = toArray(snapshot.val())
    this.setState({notes})
  },

  render() {
    return (
      <ul>
        {this.state.notes.map((note) => {
          return <li key={note.key}>{note.title}: {note.text}</li>
        })}
      </ul>
    )
  }
})