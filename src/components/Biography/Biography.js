import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Biography.module.scss'

class Biography extends Component {
  render() {
    const { className, title, events } = this.props
    // нужна проверка на !events, т.к. в NetlifyCMS нельзя задать, что все поля в объекте biography обязательные
    if (!events || events.length === 0) return null
    return (
      <div className={classNames(className, styles.root)}>
        <div className={styles.title}>{title}</div>
        <dl>
          {events.map((item) => (
            <div key={`${item.year} ${item.event}`}>
              <dt>{item.year}</dt>
              <dd>{item.event}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }
}

Biography.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  events: PropTypes.array,
}

export default Biography
