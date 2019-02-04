import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import styles from './Tags.module.scss'

const Tags = ({ className, items }) => (
  <div className={classNames(className, styles.root)}>
    <div className={styles.title}>Теги:</div>
    <ul className={styles.list}>
      {items.map((tag) => {
        return (
          <li key={tag.slug} className={styles.item}>
            <Link to={`/tag/${tag.slug}/`} aria-label={tag.title}>
              {tag.title}
            </Link>
          </li>
        )
      })}
    </ul>
  </div>
)

Tags.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
}

export default Tags
