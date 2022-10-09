import React from 'react'

export default React.createClass({

  propTypes: {

  },

  getInitialState() {
    return { editing: false }
  },

  handleToggle() {
    this.setState({ editing: !this.state.editing })
  },

  render() {

    var style = {
      content: {
        cursor: 'url(img/pen.png), pointer'
      },
      editable: {
        // font:
      },
    }

    // var editor = <textarea defaultValue='Editor' />

    var editor = <div editable={true} style={style.editable}>
      <code>
        Content
      </code>
    </div>


    var content = <div style={style.content}>Content</div>


    return (
      <div onClick={this.handleToggle}>
        <div> {this.state.editing ? editor : content}</div>
      </div>
    )
  }

})