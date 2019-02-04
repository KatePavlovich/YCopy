import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './BodyContainer.module.scss'

const BodyContainer = ({ className, variant, children }) => {
  return (
    <div className={classNames(className, styles.root, { [styles['variant' + variant]]: !!variant })}>{children}</div>
  )
}

BodyContainer.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.number,
  children: PropTypes.element,
}

export default BodyContainer
