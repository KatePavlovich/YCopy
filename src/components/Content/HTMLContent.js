import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const HTMLContent = ({ className, content }) => (
  <div className={classNames(className)} dangerouslySetInnerHTML={{ __html: content }} />
)

HTMLContent.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
}

export default HTMLContent
