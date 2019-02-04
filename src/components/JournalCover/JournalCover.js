import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import styles from './JournalCover.module.scss'

class JournalCover extends Component {
  render() {
    const {
      className,
      slugOfJournalSet,
      title,
      description,
      label,
      journalPosts,
      background,
      color,
      style,
      slug: slugOfJournal,
      isTitleLink,
      isInJournal,
    } = this.props

    return (
      <section
        className={classNames(className, styles.root, {
          [styles.isInJournal]: isInJournal,
          [styles.white]: color === 'white',
          [styles.black]: color === 'black',
          [styles.blue]: color === 'blue',
          [styles.green]: color === 'green',
          [styles.yellow]: color === 'yellow',
          [styles.purple]: color === 'purple',
          [styles.coverWhite]: style === 'white',
          [styles.coverRed]: style === 'red',
        })}
      >
        <img
          alt={title || description || ''}
          {...{
            className: styles.cover,
            src: background,
          }}
        />
        <Link to={`/journal-set/${slugOfJournalSet}`} className={styles.label} aria-label="magazine">
          <span>Журнал</span> / <span>{label}</span>
        </Link>
        <header>
          <h1 className={styles.title}>
            {isTitleLink ? (
              <Link to={`/journal/${slugOfJournal}`} aria-label={title}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h1>
          <h2 className={styles.description}>{description}</h2>
        </header>
        {journalPosts.length > 0 && (
          <ul className={styles.articles}>
            {journalPosts.map(({ title, slug }) => (
              <li key={slug}>
                <Link to={`/journal/${slugOfJournal}#${slug}`} aria-label={title}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}

JournalCover.propTypes = {
  className: PropTypes.string,
  slugOfJournalSet: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  label: PropTypes.string,
  journalPosts: PropTypes.array,
  background: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.string,
  slug: PropTypes.string,
  isTitleLink: PropTypes.bool,
}

JournalCover.defaultProps = {
  journalPosts: [],
}

export default JournalCover
