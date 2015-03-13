import React from 'react'
import firebase from '../lib/firebase'

export default React.createClass({

  componentDidMount() {
    this.fire = firebase.getRef().child('notes')
  },

  handleSubmit(e) {
    e.preventDefault()

    let title = this.refs.title.getDOMNode().value
    let text = this.refs.text.getDOMNode().value
    this.refs.title.getDOMNode().value = ''
    this.refs.text.getDOMNode().value = ''

    console.log(`add ${title} ${text}`)

    this.fire.push({ title, text })
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref='title' placeholder='Title'/>
        <input ref='text' placeholder='Note'/>
        <button type='submit'>Add</button>
      </form>
    )
  }
})