import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

const PageHelmet = ({ title, description, keywords, image, url }) => {
  let imagePath = `https://yolife.is/img/yolife-favicon.png`

  if (image) {
    imagePath = `https://yolife.is${image}`
  }

  return (
    <Helmet>
      {title && [
        <title key="title" itemProp="name">
          {title}
        </title>,
        <meta key="metaTitle" name="title" content={title} />,
        <meta key="ogTitle" property="og:title" content={title} />,
        <meta key="twitterTitle" name="twitter:title" content={title} />,
        <meta key="ogImage" property="og:image" content={imagePath} />,
        <meta key="twitterImage" name="twitter:image" content={imagePath} />,
      ]}
      {url && <meta property="og:url" content={`https://yolife.is${url}`} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {description && [
        <meta key="description" name="description" content={description} />,
        <meta key="ogDescription" property="og:description" content={description} />,
        <meta key="twitterDescription" name="twitter:description" content={description} />,
      ]}
    </Helmet>
  )
}

PageHelmet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
}

export default PageHelmet
