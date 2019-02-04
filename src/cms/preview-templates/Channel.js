import React from 'react'
import PropTypes from 'prop-types'

const toArray = (value) => (value && value.toArray()) || []

const ChannelPreviewTemplate = ({ entry, widgetFor, widgetsFor }) => {
  const channel = {
    title: entry.getIn(['data', 'title']),
    slug: entry.getIn(['data', 'title']),
    videos: toArray(entry.getIn(['data', 'videos'])).map((v) => {
      return {
        title: v.get('title'),
        url: v.get('url'),
      }
    }),
  }
}

ChannelPreviewTemplate.propTypes = {
  entry: PropTypes.object,
  widgetFor: PropTypes.func,
}

export default ChannelPreviewTemplate
