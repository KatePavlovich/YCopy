import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'

import Swiper from 'react-id-swiper'
import logo from '../../img/logo-short.svg'
import styles from './QuickNav.module.scss'

class QuickNav extends Component {
  swiper = null

  state = {
    isScrolled: true,
    isArrowsVisible: true,
  }

  handleNextClick = () => {
    this.swiper.slideNext()
  }

  handlePrevClick = () => {
    this.swiper.slidePrev()
  }

  handleScroll = () => {
    let isScrolled = false

    if (typeof window !== 'undefined') {
      isScrolled = window.scrollY < 80
    }
    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled })
    }
  }

  checkArrowsOverflow = () => {
    const nextArrow = document.querySelector('.swiper-button-next')
    this.setState({
      isArrowsVisible: !nextArrow.classList.contains('swiper-button-lock'),
    })
  }

  handleResize = () => {
    this.checkArrowsOverflow()
  }

  componentDidMount() {
    this.checkArrowsOverflow()
    document.addEventListener('scroll', this.handleScroll)

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize)
    }
  }

  render() {
    const { className, items, renderMenuItem, location, isInGuide } = this.props
    const slidesPerGroup = isInGuide ? 1 : 2

    const sliderParams = {
      slidesPerView: 'auto',
      spaceBetween: 20,
      slidesPerGroup,
      shouldSliderUpdate: true,
      watchOverflow: true,
      slideClass: 'QuickNav__slide-item',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    }
    return (
      <div
        className={classNames(className, styles.root, {
          [styles.scrolled]: !this.state.isScrolled,
          [styles.isInGuide]: isInGuide,
          [styles.isArrowsVisible]: !this.state.isArrowsVisible,
        })}
      >
        <Link to="/" aria-label="home">
          <img
            alt=""
            {...{
              className: styles.logo,
              src: logo,
            }}
          />
        </Link>
        <div className={classNames(styles.slider)}>
          <button onClick={this.handleNextClick} className={styles.next} aria-label="next" />
          <button onClick={this.handlePrevClick} className={styles.prev} aria-label="previous" />
          <Swiper {...sliderParams} ref={(node) => (node ? (this.swiper = node.swiper) : null)}>
            {items.map(({ title, url }) => (
              <div key={url} className={styles.item}>
                {renderMenuItem({ title, url, location, styles })}
              </div>
            ))}
          </Swiper>
        </div>
      </div>
    )
  }
}

QuickNav.defaultProps = {
  isInGuide: false,
}

QuickNav.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  renderMenuItem: PropTypes.func,
  location: PropTypes.object,
  isInGuide: PropTypes.bool,
}

export default QuickNav
