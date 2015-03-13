import React from 'react/addons'

import NoteList from './components/NoteList'
import AddNote from './components/AddNote'

import MarkdownTextarea from './vendor/MarkdownTextarea'

var App = React.createClass({

  render() {
    return (
      <div>
        <h1>Hmmph....</h1>
        <AddNote />
        <NoteList />
      </div>
    )
        // <MarkdownTextarea initialValue='text *markdown* 123'/>
  }

})
React.render(<App />, document.getElementById('app'))