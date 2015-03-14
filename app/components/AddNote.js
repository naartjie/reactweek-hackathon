import React from 'react'
import firebase from '../lib/firebase'
import { nextZIndex } from '../stores/notesZStore'

export default React.createClass({

  componentDidMount() {
    this.fire = firebase.getRef().child('notes')
  },

  handleSubmit(e) {
    e.preventDefault()

    let title = this.refs.title.getDOMNode().value

    if (!title) return
    this.refs.title.getDOMNode().value = ''

    this.fire.push({
      title,
      zIndex: nextZIndex(),
      left: 100,
      top: 100
    })
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref='title' placeholder='Title'/>
        <button type='submit'>Add Note</button>
      </form>
    )
  }
})