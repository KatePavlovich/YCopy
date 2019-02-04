import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { HTMLContent } from '../../components/Content'
import styles from './GuidePost.module.scss'

class GuidePost extends Component {
  render() {
    const { className, slug, title, image, html } = this.props
    return (
      <section id={slug} className={classNames(className, styles.root, 'guide_point')}>
        <header>
          <h1>{title}</h1>
        </header>
        {/* TODO: do not use styles.story twice  */}
        <div className={styles.story}>
          <p>
            <img src={image} alt={title || ''} />
          </p>
        </div>
        <HTMLContent className={styles.story} content={html} />
      </section>
    )
  }
}

GuidePost.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  html: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
}

export default GuidePost
