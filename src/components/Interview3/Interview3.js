import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import Content from '../../components/Content'
import PageHelmet from '../../components/PageHelmet'
import SocialShare from '../../components/SocialShare'
import Tags from '../../components/Tags'
import Biography from '../../components/Biography'
import styles from './Interview3.module.scss'

const defaultRenderMore = () => null

const Interview3 = ({
  className,
  title,
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
  url,
}) => {
  const Body = contentComponent || Content
  return (
    <section className={classNames(className, styles.root)}>
      <PageHelmet title={title} {...seo} url={url} />
      <div className={styles.header}>
        <h1>{title}</h1>
      </div>
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
      <div className={styles.intro}>{lead}</div>
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

Interview3.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  // image: PropTypes.string,
  author: PropTypes.string,
  photographer: PropTypes.string,
  illustrator: PropTypes.string,
  lead: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  contentComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  biography: PropTypes.object,
  tags: PropTypes.array,
  mainTag: PropTypes.object,
  seo: PropTypes.object,
  renderMore: PropTypes.func,
  url: PropTypes.string,
}

Interview3.defaultProps = {
  renderMore: defaultRenderMore,
}

export default Interview3
