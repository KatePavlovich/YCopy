import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import Hot from '../../components/Hot'
import TeaserGrid from '../../components/TeaserGrid'
import TeaserGallery from '../../components/TeaserGallery'
import Teaser from '../../components/Teaser'
import JournalCover from '../../components/JournalCover'
import styles from './Home.module.scss'
import { InView } from 'react-intersection-observer'

const renderTagLink = ({ slug, title }) => (style) => (
  <div className={style.tagLink}>
    <Link to={`/tag/${slug}`} aria-label={title}>
      {title}
    </Link>
  </div>
)

const renderPostTeaser = ({ slug, title, image, mainTag }) => (
  <Teaser
    {...{
      to: `/post/${slug}`,
      title,
      image,
      renderTagLink: renderTagLink(mainTag),
    }}
  />
)

const renderTagTitle = (slug) => (title) => (
  <Link to={`/tag/${slug}`} aria-label={title}>
    <h1>{title}</h1>
  </Link>
)

const renderTagPostTeaser = ({ slug, title, image, description, isShowDescriptionInTeaser }) => (
  <Teaser
    {...{
      to: `/post/${slug}`,
      title,
      image,
      description,
      isShowDescriptionInTeaser,
    }}
  />
)

class Home extends Component {
  state = {
    visible: false,
  }
  handleView = (inView) => {
    if (!this.state.visible) {
      this.setState({ visible: inView })
    }
  }
  render() {
    const {
      className,
      hotPosts,
      gridPosts,
      tags,
      coverPlaces,
      channels,
      mainCoversBlock: { composition, project, journal, guidesPage, hotGuides },
    } = this.props
    let muttableGridPosts = [...gridPosts]

    return (
      <div className={classNames(className, styles.root)}>
        <div className={styles.main}>
          <div className="">
            <Hot posts={hotPosts} />
            <section id="content">
              <div className={styles.mainCoversBlock}>
                {composition.split('').map((item) => {
                  switch (item) {
                    case 'J':
                      if (!journal) {
                        return null
                      }
                      return (
                        <Fragment key={item}>
                          <JournalCover {...journal} isTitleLink />
                          <TeaserGrid
                            {...{
                              className: styles.gridPosts,
                              items: muttableGridPosts.splice(0, 3),
                              chunk: 3,
                              renderItem: renderPostTeaser,
                            }}
                          />
                        </Fragment>
                      )
                    case 'P':
                      return (
                        <Fragment key={item}>
                          <TeaserGrid
                            {...{
                              className: styles.gridPosts,
                              items: muttableGridPosts.splice(0, 3),
                              chunk: 3,
                              renderItem: renderPostTeaser,
                            }}
                          />
                        </Fragment>
                      )
                    case 'G':
                      return (
                        <Fragment key={item}>
                          <TeaserGrid
                            {...{
                              className: styles.gridPosts,
                              items: muttableGridPosts.splice(0, 3),
                              chunk: 3,
                              renderItem: renderPostTeaser,
                            }}
                          />
                        </Fragment>
                      )
                    default:
                      return null
                  }
                })}
                {tags.map(({ slug, title, posts, slidesPerView, color }, index) => {
                  const coverPlace = coverPlaces[index + 1]
                  return (
                    <Fragment key={slug}>
                      <InView tag="div" onChange={(inView) => this.handleView(inView)}>
                        {this.state.visible && (
                          <TeaserGallery
                            {...{
                              title,
                              color,
                              renderTitle: renderTagTitle(slug),
                              items: posts,
                              slidesPerView,
                              renderItem: renderTagPostTeaser,
                            }}
                          />
                        )}
                      </InView>
                    </Fragment>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  className: PropTypes.string,
  hotPosts: PropTypes.array,
  gridPosts: PropTypes.array,
  tags: PropTypes.array,
  channels: PropTypes.array,
  coverPlaces: PropTypes.object,
  mainCoversBlock: PropTypes.shape({
    composition: PropTypes.string,
    project: PropTypes.object,
    journal: PropTypes.object,
    guidesPage: PropTypes.object,
    hotGuides: PropTypes.array,
  }),
}

export default Home
