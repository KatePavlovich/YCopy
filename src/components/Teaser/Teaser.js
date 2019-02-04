import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import styles from './Teaser.module.scss'

const Teaser = ({ className, to, title, description, isShowDescriptionInTeaser, image, renderTagLink }) => (
  <article className={classNames(className, styles.root)}>
    <Link to={to} aria-label={title}>
      <div className={styles.inner}>
        <header>
          <h2>{title}</h2>
          {isShowDescriptionInTeaser && <p className={styles.description}>{description}</p>}
        </header>
        <img
          alt={title || ''}
          {...{
            className: styles.image,
            src: image,
          }}
        />
      </div>
    </Link>
    <div className={styles.meta}>{renderTagLink && renderTagLink(styles)}</div>
  </article>
)

Teaser.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isShowDescriptionInTeaser: PropTypes.bool,
  image: PropTypes.string,
  renderTagLink: PropTypes.func,
}

export default Teaser
