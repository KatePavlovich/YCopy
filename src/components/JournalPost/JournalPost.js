import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PageHelmet from '../../components/PageHelmet'
import { HTMLContent } from '../../components/Content'
import SocialShare from '../../components/SocialShare'
import JournalSetLink from './JournalSetLink'
import styles from './JournalPost.module.scss'

class JournalPost extends Component {
  render() {
    const {
      className,
      html,
      title,
      description,
      persona,
      image,
      author,
      photographer,
      footnote,
      slug,
      journalSet,
    } = this.props
    return (
      <div>
        <PageHelmet description={title} />
        <section id={slug}>
          <section className={classNames(className, styles.root)}>
            <div>
              <div className={styles.header}>
                <h2 className={styles.description}>
                  {persona && <div className={styles.persona}>{persona}</div>}
                  {description}
                </h2>
                <img
                  alt={title || description || ''}
                  {...{
                    className: styles.image,
                    src: image,
                  }}
                />
                <div className={styles.meta}>
                  <p>
                    <strong>Текст:</strong>
                    <br />
                    {author}
                  </p>
                  {photographer && (
                    <p className={styles.photographer}>
                      <strong>Фото:</strong>
                      <br />
                      {photographer}
                    </p>
                  )}
                  <p>
                    <JournalSetLink {...journalSet} />
                  </p>
                </div>
              </div>
              <div className={styles.body}>
                <h1 className={styles.title}>{title}</h1>
                <HTMLContent className={styles.content} content={html} />
                {footnote && <div className={styles.footnote}>{footnote}</div>}
                <SocialShare journalPostVariation />
              </div>
            </div>
          </section>
        </section>
      </div>
    )
  }
}

JournalPost.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  persona: PropTypes.string,
  image: PropTypes.string,
  slug: PropTypes.string,
  html: PropTypes.string,
  author: PropTypes.string,
  photographer: PropTypes.string,
  footnote: PropTypes.string,
  journalSet: PropTypes.object,
}

export default JournalPost
