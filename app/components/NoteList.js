import React from 'react'
import Note from './Note'
import fire from '../lib/firebase'
import notesZStore from '../stores/notesZStore'

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
    this.fire.off('value', this.updateMe)
  },

  updateMe(snapshot) {
    var notes = toArray(snapshot.val())
    this.setState({notes})
  },

  render() {
    var style = {
      position: 'relative'
    }

    return (
      <div style={style}>
        {this.state.notes.map((note, idx) => {
          return <Note
            key={note.key}
            _key={note.key}
            left={note.left}
            top={note.top}
            maxZ={notesZStore.maxZIndex}
            zIndex={note.zIndex}
            title={note.title}
            text={note.text}
            index={idx} />
        })}
      </div>
    )
  }
})