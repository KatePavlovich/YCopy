import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Gallery from 'react-photo-gallery'
import Lightbox from 'react-images'
import Image from './Image'
import styles from './Images.module.scss'

class Images extends Component {
  state = { currentImage: 0 }

  openLightbox = (_, obj) => {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    })
  }

  closeLightbox = () => {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    })
  }

  gotoPrevious = () => {
    this.setState((state) => {
      return {
        currentImage: this.state.currentImage - 1,
      }
    })
  }

  gotoNext = () => {
    this.setState({
      currentImage: this.state.currentImage + 1,
    })
  }

  render() {
    const { className, items } = this.props
    const { currentImage, lightboxIsOpen } = this.state
    return (
      <div className={classNames(className, styles.root)}>
        <Gallery {...{ photos: items, ImageComponent: Image, direction: 'column', onClick: this.openLightbox }} />
        <Lightbox
          {...{
            images: items,
            onClose: this.closeLightbox,
            onClickPrev: this.gotoPrevious,
            onClickNext: this.gotoNext,
            currentImage,
            isOpen: lightboxIsOpen,
          }}
        />
      </div>
    )
  }
}

Images.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
}

export default Images
