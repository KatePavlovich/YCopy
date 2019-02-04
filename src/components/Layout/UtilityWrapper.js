import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './UtilityWrapper.module.scss'

const UtilityWrapper = ({ className, children }) => {
  return <div className={classNames(className, styles.root)}>{children}</div>
}

UtilityWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
}

export default UtilityWrapper
