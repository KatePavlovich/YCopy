import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PageHelmet from '../../components/PageHelmet'
import QuickNav from '../../components/QuickNav'
import JournalCover from '../../components/JournalCover'
import JournalPost from '../../components/JournalPost'
import styles from './Journal.module.scss'
import { Link } from 'react-scroll'

const renderMenuItem = ({ url, title, location, styles }) => {
  return (
    <Link
      activeClass="active-journal-link"
      to={url}
      spy={true}
      smooth={true}
      offset={-40}
      duration={200}
      aria-label={title}
    >
      {title}
    </Link>
  )
}

class Journal extends Component {
  componentDidMount() {
    const { action, hash } = this.props.location
    if (!action) {
      this.correctHash = hash.replace('#', '')
    }
  }

  render() {
    const {
      className,
      title,
      description,
      label,
      location,
      journalPosts,
      slugOfJournalSet,
      background,
      color,
      style,
    } = this.props
    return (
      <div className={classNames(className, styles.root)}>
        <PageHelmet title={title} image={background} url={location.pathname} />
        <div className={styles.navigation}>
          <QuickNav
            {...{
              location,
              items: journalPosts.map(({ slug, title }) => ({
                url: slug,
                title,
              })),
              renderMenuItem,
            }}
          />
        </div>
        <JournalCover
          {...{
            className: styles.JournalCover,
            isInJournal: true,
            slugOfJournalSet,
            title,
            description,
            label,
            background,
            color,
            style,
          }}
        />
        <div className={styles.posts}>
          {journalPosts.map((item) => (
            <JournalPost key={item.slug} {...item} />
          ))}
          {/* <PageHelmet description={item.title} url={`${location.pathname}#${item.slug}`} /> */}
        </div>
      </div>
    )
  }
}

Journal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  label: PropTypes.string,
  location: PropTypes.object,
  journalPosts: PropTypes.array,
  slugOfJournalSet: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
}

export default Journal
