import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import styles from './JournalSetLink.module.scss'

class JournalSetLink extends Component {
  render() {
    const { className, title, slug } = this.props
    return (
      <Link to={`/journal-set/${slug}`} className={classNames(className, styles.root)} aria-label={title}>
        {title}
      </Link>
    )
  }
}

JournalSetLink.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
}

export default JournalSetLink
