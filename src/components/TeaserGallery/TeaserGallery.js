import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Swiper from 'react-id-swiper'
import styles from './TeaserGallery.module.scss'

class TeaserGallery extends Component {
  swiper = null

  handleNextClick = () => {
    this.swiper.slideNext()
  }

  handlePrevClick = () => {
    this.swiper.slidePrev()
  }

  render() {
    const { className, title, color, renderTitle, items, slidesPerView, renderItem } = this.props
    const params = {
      rebuildOnUpdate: true,
      shouldSwiperUpdate: true,
      slidesPerView,
      slidesPerGroup: 1,
      spaceBetween: 24,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1000: {
          slidesPerView: 2,
          spaceBetween: 18,
        },
        768: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
      },
    }
    if (items.length === 0) return null
    return (
      <section className={classNames(className, styles.root)}>
        <div className={`${styles.inner} ${styles.modBg} ${styles.modTypeCA}`}>
          <header className={`${styles.header} ${styles[color]}`}>{renderTitle(title)}</header>
          <div className={styles.swiper}>
            <button onClick={this.handleNextClick} className={styles.next} aria-label="next" />
            <button onClick={this.handlePrevClick} className={styles.prev} aria-label="previous" />
            <Swiper {...params} ref={(node) => (node ? (this.swiper = node.swiper) : null)}>
              {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}> */}
              {items.map((item) => (
                // <div key={item.slug} className={styles.item} style={{ width: chunk ? `${100 / chunk}%` : 'auto' }}>
                <div key={item.slug} className={styles.item}>
                  {renderItem(item)}
                </div>
              ))}
              {/* </div> */}
            </Swiper>
          </div>
        </div>
      </section>
    )
  }
}

TeaserGallery.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  renderTitle: PropTypes.func,
  items: PropTypes.array,
  slidesPerView: PropTypes.number,
  renderItem: PropTypes.func,
}

export default TeaserGallery
