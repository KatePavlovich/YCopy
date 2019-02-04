import React from 'react'
import PropTypes from 'prop-types'
import About from '../../components/About'

const AboutPreviewTemplate = ({ entry, widgetFor }) => (
  <About title={entry.getIn(['data', 'title'])} content={widgetFor('body')} />
)

AboutPreviewTemplate.propTypes = {
  entry: PropTypes.object,
  widgetFor: PropTypes.func,
}

export default AboutPreviewTemplate
