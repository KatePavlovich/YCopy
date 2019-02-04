import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PageHelmet from '../../components/PageHelmet'
import TeaserGrid from '../../components/TeaserGrid'
import JournalCover from '../../components/JournalCover'
import styles from './JournalSet.module.scss'

const renderJournalCover = (item) => <JournalCover {...item} isTitleLink />

class JournalSet extends Component {
  render() {
    const { className, title, journals } = this.props
    return (
      <Fragment>
        <PageHelmet title={title} />
        <TeaserGrid
          {...{
            className: classNames(className, styles.root),
            isInJournalSet: true,
            title,
            items: journals,
            chunk: 1,
            renderItem: renderJournalCover,
          }}
        />
      </Fragment>
    )
  }
}

JournalSet.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  journals: PropTypes.array,
}

export default JournalSet
