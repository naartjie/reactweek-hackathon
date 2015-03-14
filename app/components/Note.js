import React from 'react'
import Draggable from 'react-draggable'
import MarkdownTextarea from '../vendor/MarkdownTextarea'
import fire from '../lib/firebase'

export default React.createClass({

  propTypes: {
    zIndex: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.  isRequired,
    text: React.PropTypes.string,
  },

  getInitialState() {
    return {
      zIndex: this.props.zIndex
    }
  },

  componentDidMount() {
    this.fire = fire.getRef().child(`notes/${this.props._key}`)
  },

  componentWillReceiveProps(nextProps) {
    this.refs.markdown.setState({
      value: nextProps.text
    });
  },

  handleRemove() {
    this.fire.remove()
  },

  handleDrag(e, ui) {
    var {top, left} = ui.position
    this.fire.update({left, top})
  },

  handleStopDrag() {
    var newZ = this.state.zIndex + 1
    this.setState({
      zIndex: newZ
    })
    this.fire.update({zIndex: newZ})
  },

  handleUpdateText(text) {
    this.fire.update({text})
  },

  render() {

    var { title, text } = this.props

    return (
      <Draggable
        zIndex={this.state.zIndex}
        onDrag={this.handleDrag}
        onStop={this.handleStopDrag}
      >
        <div>
          <h4>{title}</h4>
          <MarkdownTextarea
            ref='markdown'
            initialValue={text}
            onChange={this.handleUpdateText}
          />
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