import React from 'react'
import Draggable from 'react-draggable'
import MarkdownTextarea from '../vendor/MarkdownTextarea'
import fire from '../lib/firebase'

export default React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
  },

  handleRemove() {
    fire.getRef().child(`notes/${this.props._key}`).remove()
  },

  render() {

    var style = {
      border: 'solid 1px'
    }

    var { title, text } = this.props

    return (
      <Draggable zIndex={100}>
        <div>
          <MarkdownTextarea initialValue='test 123' />
        </div>
      </Draggable>
    )

      // <div>test 123</div>
      //   {// axis="x"
      //   // handle=".handle"
      //   // grid={[25, 25]}
      //   // start={{x: 25, y: 25}}
      //   // zIndex={100}
      //   // onStart={this.handleStart}
      //   // onDrag={this.handleDrag}
      //   // onStop={this.handleStop}> }


      //   <div className='box'>
      //     <h4>{title}</h4>
      //     <MarkdownTextarea initialValue='test 123' />
      //   </div>

  }
})