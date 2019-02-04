import React from 'react'
import PropTypes from 'prop-types'
import Interview2 from '../../components/Interview2'

const toArray = (value) => (value && value.toArray()) || []

const Interview2PreviewTemplate = ({ entry, widgetFor, widgetsFor }) => {
  const biography = {
    title: widgetsFor('biography').getIn(['data', 'title']),
    events: toArray(widgetsFor('biography').getIn(['data', 'events'])).map((item) => {
      return {
        year: item.get('year'),
        event: item.get('event'),
      }
    }),
  }
  const tags = toArray(entry.getIn(['data', 'tags'])).map((item) => {
    const tag = item.get('tag')
    return { title: tag, slug: tag }
  })
  return (
    <Interview2
      {...{
        title: entry.getIn(['data', 'title']),
        description: entry.getIn(['data', 'description']),
        lead: entry.getIn(['data', 'lead']),
        publishDate: entry.getIn(['data', 'publishDate']),
        author: entry.getIn(['data', 'author']),
        photographer: entry.getIn(['data', 'photographer']),
        image: widgetsFor('image').get('data'),
        content: widgetFor('body'),
        biography,
        seo: {},
        mainTag: { title: entry.getIn(['data', 'mainTag']) },
        tags,
        isAdminDashboard: true,
      }}
    />
  )
}

Interview2PreviewTemplate.propTypes = {
  entry: PropTypes.object,
  widgetFor: PropTypes.func,
  widgetsFor: PropTypes.func,
}

export default Interview2PreviewTemplate
