import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import styles from './PostCard.module.scss'

class PostCard extends Component {
  render() {
    const { className, slug, title, description, mainTag, onMouseEnter, onMouseLeave, isSelected } = this.props
    return (
      <Link
        {...{
          to: `/post/${slug}`,
          className: classNames(className, styles.root, styles.card, {
            selected: isSelected,
          }),
          onMouseEnter,
          onMouseLeave,
        }}
        aria-label={title}
      >
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
        <span className={styles.meta}>{`${mainTag.title}`}</span>
      </Link>
    )
  }
}

PostCard.propTypes = {
  className: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  mainTag: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  isSelected: PropTypes.bool,
}

export default PostCard
