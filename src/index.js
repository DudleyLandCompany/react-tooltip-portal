import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import document from 'global/document'

const TOP = 'top'
const LEFT = 'left'
const BOTTOM = 'bottom'
const RIGHT = 'right'

export default class TooltipPortal extends PureComponent {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    offset: PropTypes.number.isRequired,
    position: PropTypes.string,
    tipStyle: PropTypes.object
  }

  static defaultProps = {
    active: false,
    offset: 10,
    position: 'left',
    tipStyle: {}
  }

  render () {
    if (!this.props.active || !this.props.parent) return null

    return createPortal(
      <Tooltip
        active={this.props.active}
        parent={this.props.parent}
        offset={this.props.offset}
        position={this.props.position}
        tipStyle={this.props.tipStyle}
      >
        {this.props.children}
      </Tooltip>,
      document.body,
    );
  }
}

class Tooltip extends PureComponent {

  state = {
    top: 0,
    left: 0
  }

  componentDidMount () {
    this.getTipPosition()
  }

  componentWillUpdate () {
    this.getTipPosition()
  }

  getTipPosition = () => {
    const { parent, position, offset } = this.props
    if (!this.tip) return

    let scrollY = (window.scrollY !== undefined) ? window.scrollY : window.pageYOffset
    let scrollX = (window.scrollX !== undefined) ? window.scrollX : window.pageXOffset

    const pNode = parent.getBoundingClientRect()
    const tipNode = this.tip.getBoundingClientRect()

    let top
    let left


    switch (position) {
      case TOP:
        top = scrollY + pNode.top - tipNode.height - offset
        left = scrollX + pNode.left + (pNode.width / 2) - (tipNode.width / 2)
        break

      case LEFT:
        top = scrollY + pNode.top + (pNode.height / 2) - offset
        left = scrollX + pNode.left - offset - tipNode.width
        break

      case BOTTOM:
        top = scrollY + pNode.top + pNode.height + offset
        left = scrollX + pNode.left + (pNode.width / 2) - (tipNode.width / 2)
        break

      case RIGHT:
        top = scrollY + pNode.top + (pNode.height / 2) - offset
        left = scrollX + pNode.left + pNode.width + offset
        break

      default:
    }

    this.setState({ top, left })
  }

  render () {
    const { active, parent, tipStyle } = this.props
    const { top, left } = this.state

    return (
      <div
        ref={c => this.tip = c}
        style={{
          position: 'absolute',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 8,
          top,
          left,
          ...tipStyle
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
