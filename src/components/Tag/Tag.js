import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import TeaserGrid from '../../components/TeaserGrid'
import PageHelmet from '../../components/PageHelmet'
import Teaser from '../../components/Teaser'
import styles from './Tag.module.scss'

const renderTagTeaser = ({ slug, title, image, description, isShowDescriptionInTeaser }) => (
  <Teaser {...{ to: `/post/${slug}`, title, image, description, isShowDescriptionInTeaser }} />
)

class Tag extends Component {
  render() {
    const { className, title, color, posts, chunk, image } = this.props
    return (
      <div>
        <PageHelmet title={title} image={image} url={'/tag'} />
        <TeaserGrid
          {...{
            className: classNames(className, styles.root),
            title,
            color,
            items: posts,
            chunk,
            renderItem: renderTagTeaser,
          }}
        />
      </div>
    )
  }
}

Tag.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  posts: PropTypes.array,
  chunk: PropTypes.number,
  image: PropTypes.string,
}

export default Tag
