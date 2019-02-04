import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Image.module.scss'

const cont = {
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
}

class Image extends Component {
  handleClick = (event) => {
    const { onClick, index, photo } = this.props
    onClick(event, { index, photo })
  }

  shouldComponentUpdate(nextProps) {
    const { height, width } = this.props
    return nextProps.height === height || nextProps.width === width
  }

  render() {
    const {
      className,
      margin,
      direction,
      left,
      top,
      photo: { src, alt, caption, height, width },
    } = this.props
    if (direction === 'column') {
      cont.position = 'absolute'
      cont.left = left
      cont.top = top
    }
    return (
      <div
        {...{
          className: classNames(className, styles.root),
          style: { margin, height, width, ...cont },
          onClick: this.handleClick,
        }}
      >
        <img alt={alt ? alt : caption || ''} src={src} />
        {caption && <div className={styles.description}>{caption}</div>}
      </div>
    )
  }
}

Image.propTypes = {
  className: PropTypes.string,
  margin: PropTypes.number,
  direction: PropTypes.string,
  left: PropTypes.number,
  top: PropTypes.number,
  index: PropTypes.number,
  onClick: PropTypes.func,
  photo: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string,
  }),
}

export default Image
