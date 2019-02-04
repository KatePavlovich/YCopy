import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import Content from '../../components/Content'
import PageHelmet from '../../components/PageHelmet'
import SocialShare from '../../components/SocialShare'
import Tags from '../../components/Tags'
import Biography from '../../components/Biography'
import { Link as ScrollLink } from 'react-scroll'
import iconArrowDown from '../../icons/white-chevron-down.svg'
import styles from './Interview2.module.scss'

const defaultRenderMore = () => null

class Interview2 extends Component {
  render() {
    const {
      className,
      title,
      description,
      image,
      author,
      photographer,
      illustrator,
      lead,
      content,
      contentComponent,
      biography,
      tags,
      mainTag,
      seo,
      renderMore,
      isAdminDashboard,
      url,
    } = this.props

    const Body = contentComponent || Content
    return (
      <section className={classNames(className, styles.root)}>
        <PageHelmet title={title} image={image} {...seo} url={url} />
        <div
          className={styles.cover}
          style={{
            backgroundImage: `linear-gradient(
              rgba(0, 0, 2, 0.4),
              rgba(0, 0, 20, 0.6)
            ), url(${image})`,
          }}
        >
          <div className={styles.headerWrapper}>
            <div className={styles.header}>
              <div>
                <h1>{title}</h1>
                {description && <h2>{description}</h2>}
                <div className={styles.intro}>{lead}</div>
              </div>
            </div>
            <ScrollLink
              to="content"
              className={styles.arrowDown}
              spy={true}
              smooth={true}
              duration={200}
              aria-label="down"
            >
              <img
                alt=""
                {...{
                  src: iconArrowDown,
                  width: 32,
                  height: 32,
                }}
              />
            </ScrollLink>
          </div>
        </div>
        <section {...{ isAdminDashboard, id: 'content' }}>
          <div className={styles.meta}>
            <div>
              <p>
                <strong>Текст:</strong>
                <span>{author}</span>
              </p>
              {photographer && (
                <p>
                  <strong>Фото:</strong>
                  <span>{photographer}</span>
                </p>
              )}
              {illustrator && (
                <p>
                  <strong>Иллюстрации:</strong>
                  <span>{illustrator}</span>
                </p>
              )}
            </div>
            <div>
              <p className={styles.mainTag}>
                <Link to={`/tag/${mainTag.slug}/`} aria-label={mainTag.title}>
                  {mainTag.title}
                </Link>
              </p>
            </div>
          </div>
        </section>
        <div className={styles.conversation}>
          <Body content={content} />
        </div>
        {biography && <Biography className={styles.biography} {...biography} />}
        <hr className={styles.hr} />
        <SocialShare />
        <Tags items={tags} className={styles.tags} />
        <div className={styles.renderMore}>{renderMore(styles)}</div>
      </section>
    )
  }
}

Interview2.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  author: PropTypes.string,
  photographer: PropTypes.string,
  illustrator: PropTypes.string,
  lead: PropTypes.string,
  descripton: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  contentComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  biography: PropTypes.object,
  tags: PropTypes.array,
  mainTag: PropTypes.object,
  seo: PropTypes.object,
  renderMore: PropTypes.func,
  isAdminDashboard: PropTypes.bool,
  url: PropTypes.string,
}

Interview2.defaultProps = {
  renderMore: defaultRenderMore,
}

export default Interview2
