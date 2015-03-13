import React from 'react'
import Note from './Note'
import fire from '../lib/firebase'
import { toArray } from '../lib/utils'

export default React.createClass({

  getInitialState() {
    return { notes: [] }
  },

  componentDidMount() {
    this.fire = fire.getRef().child('notes')
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
        {this.state.notes.map((note, idx) => {
          return <Note
            key={note.key}
            _key={note.key}
            title={note.title}
            text={note.text}
            index={idx} />
        })}
      </ul>
    )
  }
})