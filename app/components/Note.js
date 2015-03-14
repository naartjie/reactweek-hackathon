import React from 'react'
import Draggable from 'react-draggable'
import MarkdownTextarea from '../vendor/MarkdownTextarea'
import fire from '../lib/firebase'

export default React.createClass({

  propTypes: {
    zIndex: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    maxZ: React.PropTypes.func.isRequired,

    text: React.PropTypes.string,
    left: React.PropTypes.number,
    top: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      top: 0,
      left: 0,
      text: '',
      maxZ: () => {}
    }
  },

  // getInitialState() {
  //   return { zIndex: this.props.zIndex }
  // },

  componentDidMount() {
    this.fire = fire.getRef().child(`notes/${this.props._key}`)
  },

  componentWillReceiveProps(nextProps) {
    this.refs.markdown.setState({
      value: nextProps.text,
    })
    this.refs.draggable.setState({
      clientX: nextProps.left,
      clientY: nextProps.top,
      // zIndex: nextProps.zIndex,
    })
  },

  handleRemove() {
    this.fire.remove()
  },

  handleDrag(e, ui) {
    var {top, left} = ui.position
    this.fire.update({left, top})
  },

  handleStopDrag() {
    var maxZ = this.props.maxZ()

    console.log('maxZ', maxZ)

    if (maxZ > this.props.zIndex) {
      this.refs.draggable.zIndexDropped = maxZ + 1
      this.fire.update({zIndex: maxZ + 1})
    }
  },

  handleUpdateText(text) {
    this.fire.update({text})
  },

  render() {

    var { title, text, left, top } = this.props
    var position = {x: left, y: top}

    return (
      <Draggable
        ref='draggable'
        zIndex={1000000}
        zIndexDropped={this.props.zIndex}
        start={position}
        onDrag={this.handleDrag}
        onStop={this.handleStopDrag}>

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
  }
})