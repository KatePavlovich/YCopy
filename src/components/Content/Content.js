import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Content = ({ className, content }) => <div className={classNames(className)}>{content}</div>

Content.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
}

export default Content
