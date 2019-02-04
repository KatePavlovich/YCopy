import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import PageHelmet from '../../components/PageHelmet'
import SocialShare from '../../components/SocialShare'
import Tags from '../../components/Tags'
import Images from './Images'
import styles from './Masonry.module.scss'

const Masonry = ({
  className,
  title,
  image,
  photographer,
  illustrator,
  lead,
  images,
  tags,
  mainTag,
  seo,
  renderMore,
  url,
}) => {
  return (
    <section className={classNames(className, styles.root)}>
      <PageHelmet title={title} image={image} {...seo} url={url} />
      <div className={styles.header}>
        <h1>{title}</h1>
      </div>
      <div className={styles.meta}>
        <div>
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
            <Link to={`/tag/${mainTag.slug}/`}>{mainTag.title}</Link>
          </p>
        </div>
      </div>
      <div className={styles.intro}>{lead}</div>
      <div>
        {/* <Body content={content} /> */}
        <Images className={styles.images} items={images.map(({ image, ...opts }) => ({ src: image, ...opts }))} />
      </div>
      <hr className={styles.hr} />
      <SocialShare />
      <Tags items={tags} className={styles.tags} />
      <div className={styles.renderMore}>{renderMore(styles)}</div>
    </section>
  )
}

Masonry.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  image: PropTypes.string,
  photographer: PropTypes.string,
  illustrator: PropTypes.string,
  lead: PropTypes.string,
  images: PropTypes.array,
  tags: PropTypes.array,
  mainTag: PropTypes.object,
  seo: PropTypes.object,
  renderMore: PropTypes.func,
  url: PropTypes.string,
}

export default Masonry
