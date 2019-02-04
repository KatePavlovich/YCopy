import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styles from './Excerpt.module.scss'

class Excerpt extends Component {
  render() {
    const { url, title, description } = this.props
    return (
      <div className={styles.wrapper}>
        <Link to={url} className={styles.content} aria-label={title}>
          <h1 className={styles.title}>{title}</h1>
          {description && <h2 className={styles.description}>{description}</h2>}
        </Link>
      </div>
    )
  }
}

Excerpt.propTypes = {
  className: PropTypes.string,
}

export default Excerpt
