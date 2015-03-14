import React from 'react/addons'
import NoteList from './components/NoteList'
import AddNote from './components/AddNote'

var App = React.createClass({

  render() {
    return (
      <div>
        <AddNote />
        <NoteList />
      </div>
    )
  }
})

React.render(<App />, document.getElementById('app'))