import React from 'react'

import NoteList from './components/NoteList'
import AddNote from './components/AddNote'

var App = React.createClass({

  render() {
    return (
      <div>
        <h1>ReReNote App</h1>
        <AddNote />
        <NoteList />
      </div>
    )
  }

})

React.render(<App />, document.getElementById('app'))