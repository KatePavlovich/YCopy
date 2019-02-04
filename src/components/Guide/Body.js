import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import SocialShare from 'src/components/SocialShare'
import { HTMLContent } from 'src/components/Content'
import GuidePost from 'src/components/GuidePost'
import styles from './Body.module.scss'

class Body extends Component {
  render() {
    const { className, title, description, html, image, guidesPage, guidePosts } = this.props
    if (!guidePosts) return null
    return (
      <section className={classNames(className, styles.root)}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.meta}>
            <div className={styles.label}>
              <Link to="/guides" aria-label={guidesPage.title}>
                {guidesPage.title}
              </Link>
            </div>
            <SocialShare noIndentation />
          </div>
          <div className={styles.intro}>
            <p>
              <img src={image} alt={title} />
            </p>
          </div>
          <HTMLContent className={styles.intro} content={html} />
        </header>
        {guidePosts.map(({ slug, ...guidePost }) => (
          <GuidePost key={slug} slug={slug} {...guidePost} />
        ))}
      </section>
    )
  }
}

Body.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  html: PropTypes.string,
  image: PropTypes.string,
  guidesPage: PropTypes.object,
  guidePosts: PropTypes.array,
}

export default Body
