import React from 'react'
import Draggable from '../vendor/Draggable'
import MarkdownTextarea from '../vendor/MarkdownTextarea'
import { DRAG_Z_INDEX } from '../lib/constants'
import fire from '../lib/firebase'

export default React.createClass({

  getInitialState() {
    return {
      cancelEdit: false,
    }
  },

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
    })
  },

  handleRemove() {
    this.fire.remove()
  },

  handleStartDrag() {
    this.prevZIndex = this.props.zIndex
  },

  handleDrag(e, ui) {
    var {top, left} = ui.position
    this.fire.update({left, top, zIndex: DRAG_Z_INDEX})
  },

  handleStopDrag() {
    var maxZ = Math.max(this.props.maxZ(), this.prevZIndex)
    this.fire.update({zIndex: maxZ + 1})
  },

  handleUpdateText(text) {
    this.fire.update({text})
  },

  handleUnedit() {
    this.setState({
      cancelEdit: true
    })

    // HACK!!
    setTimeout(function() {
      this.setState({cancelEdit: false})
    }.bind(this), 10)
  },

  handleClickLink(e) {
    var url = e.target.getAttribute('href')

    if (url.startsWith('internal')) {
      e.preventDefault()
      // TODO find note and set focus
    } else {
      e.target.setAttribute('target', '_blank')
    }
  },

  render() {

    var { title, text, left, top } = this.props
    var position = {x: left, y: top, width: 220, height: 100}
    return (
      <Draggable
        ref='draggable'
        zIndex={DRAG_Z_INDEX}
        zIndexDropped={this.props.zIndex}
        start={position}
        onStart={this.handleStartDrag}
        onDrag={this.handleDrag}
        onStop={this.handleStopDrag}>

        <div>
          <h4>
            {title}{' '}
            <i onClick={this.handleRemove} className="fa fa-trash-o"></i>{' '}
            <i onClick={this.handleUnedit} className="fa fa-check"></i>{' '}
          </h4>
          <MarkdownTextarea
            cancelEdit={this.state.cancelEdit}
            ref='markdown'
            initialValue={text}
            onChange={this.handleUpdateText}
            onClickLink={this.handleClickLink}
          />
        </div>
      </Draggable>
    )
  }
})