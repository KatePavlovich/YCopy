import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import min from 'lodash/min'
import styles from './TeaserGrid.module.scss'

const defaultRenderTitle = (title) => <h1>{title}</h1>

class TeaserGrid extends Component {
  render() {
    const {
      className,
      title,
      color,
      renderTitle,
      items,
      chunk,
      renderItem,
      isInJournalSet,
      isRenderMore,
      isInterview1RenderMore,
      isInterview2RenderMore,
      isInterview3RenderMore,
      isMasonryRenderMore,
    } = this.props
    if (items.length === 0) return null
    const slidesToShow = min([items.length, chunk])
    return (
      <section
        className={classNames(className, styles.root, {
          [styles.isInJournalSet]: isInJournalSet,
          [styles.isRenderMore]: isRenderMore,
          [styles.isInterview1RenderMore]: isInterview1RenderMore,
          [styles.isInterview2RenderMore]: isInterview2RenderMore,
          [styles.isInterview3RenderMore]: isInterview3RenderMore || isMasonryRenderMore,
        })}
      >
        <div className={`${styles.inner} ${styles.modBg} ${styles.modTypeCA}`}>
          {title && <header className={`${styles.header} ${styles[color]}`}>{renderTitle(title)}</header>}
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.slug} className={classNames(styles[`itemInRow${slidesToShow}`], styles.item)}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

TeaserGrid.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  renderTitle: PropTypes.func,
  items: PropTypes.array,
  chunk: PropTypes.number,
  renderItem: PropTypes.func,
}

TeaserGrid.defaultProps = {
  renderTitle: defaultRenderTitle,
}

export default TeaserGrid
