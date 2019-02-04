import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PageHelmet from '../../components/PageHelmet'
import TeaserGrid from '../../components/TeaserGrid'
import Teaser from '../../components/Teaser'
import styles from './Guides.module.scss'

const renderGuideTeaser = ({ slug, title, image }) => <Teaser {...{ to: `/guide/${slug}`, title, image }} />

class Guides extends Component {
  render() {
    const { className, title, guides, chunk, seo } = this.props
    return (
      <Fragment>
        <PageHelmet title={title} {...seo} />
        <TeaserGrid
          {...{
            className: classNames(className, styles.root),
            title,
            items: guides,
            chunk,
            renderItem: renderGuideTeaser,
          }}
        />
      </Fragment>
    )
  }
}

Guides.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  guides: PropTypes.array,
  chunk: PropTypes.number,
}

export default Guides
