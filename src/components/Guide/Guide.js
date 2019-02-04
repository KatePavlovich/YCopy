import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import PageHelmet from 'src/components/PageHelmet'
import QuickNav from 'src/components/QuickNav'
import Body from './Body'
import GuideMap from './GuideMap'
import styles from './Guide.module.scss'

const renderMenuItem = ({ url, title, location, styles }) => {
  const currentUrl = location.pathname
  return (
    <Link
      to={url}
      className={currentUrl.replace(/\//g, '') === url.replace(/\//g, '') ? styles.active : styles.notActive}
      aria-label={title}
    >
      {title}
    </Link>
  )
}

class Guide extends Component {
  state = {
    activePoint: null,
  }

  componentDidMount() {
    const config = {
      threshold: [0.1, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
    this.observer = new IntersectionObserver((entries) => {
      if (entries.length === 1)
        entries.forEach((entry) => {
          if (entry.intersectionRect.height > entry.rootBounds.height * 0.5) {
            this.setState({
              activePoint: this.props.guidePosts.find((post) => post.slug === entry.target.id),
            })
          }
        })
    }, config)
    this.updateObserverPoints()
  }

  updateObserverPoints() {
    const points = document.querySelectorAll('.guide_point')
    points.forEach((point) => {
      this.observer.observe(point)
    })
  }

  componentDidUpdate() {
    this.observer.takeRecords()
    this.updateObserverPoints()
  }

  componentWillUnmount() {
    this.observer.disconnect()
  }

  handleChangeActivePoint = (activePoint) => {
    this.setState({ activePoint })
  }

  render() {
    const {
      className,
      location,
      guides,
      title,
      html,
      image,
      guidesPage,
      guidePosts,
      longitude,
      latitude,
      zoom,
    } = this.props
    const guide = guides && guides.find((guide) => guide.title === title)
    return (
      <div className={classNames(className, styles.root)}>
        <PageHelmet title={title} image={image} url={location.pathname} />
        <div className={styles.navigation}>
          <QuickNav
            {...{
              location,
              items: guides.map(({ slug, title }) => ({
                url: `/guide/${slug}`,
                title,
              })),
              renderMenuItem,
              isInGuide: true,
            }}
          />
        </div>
        <div className={classNames(styles.wrapper, { [styles.withMap]: true })}>
          <GuideMap
            key={title}
            className={styles.map}
            points={guidePosts}
            activePoint={this.state.activePoint}
            zoom={zoom}
            latitude={latitude}
            longitude={longitude}
            onChangeActivePoint={this.handleChangeActivePoint}
          />
          <Body
            {...{
              className: styles.guide,
              title,
              html,
              image,
              description: guide.description,
              guidesPage,
              guidePosts,
            }}
          />
        </div>
      </div>
    )
  }
}

Guide.propTypes = {
  className: PropTypes.string,
  location: PropTypes.object,
  title: PropTypes.string.isRequired,
  html: PropTypes.string,
  image: PropTypes.string,
  guidesPage: PropTypes.object,
  guidePosts: PropTypes.array,
  guides: PropTypes.array,
}

export default Guide
