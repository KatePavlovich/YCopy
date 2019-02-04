import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

const LayoutHelmet = () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
            keywords
            description
            ogSitename
            ogTitle
            ogDescription
            ogUrl
            ogLocale
            twitterTitle
            twitterDescription
          }
        }
      }
    `}
    render={(data) => (
      <Helmet>
        <title itemProp="name">{data.site.siteMetadata.title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://yolife.is/" />
        <link rel="image_src" href={'https://yolife.is/img/yolife-favicon.png'} />
        <link href="https://fonts.googleapis.com/css?family=Lora|Oswald:400,700|Rubik:400,700" rel="stylesheet" />
        <meta name="title" content={data.site.siteMetadata.title} />
        <meta name="keywords" content={data.site.siteMetadata.keywords} />
        <meta name="description" content={data.site.siteMetadata.description} />
        <meta property="og:site_name" content={data.site.siteMetadata.ogSitename} />
        <meta property="og:title" content={data.site.siteMetadata.ogTitle} />
        <meta property="og:description" content={data.site.siteMetadata.ogDescription} />
        <meta property="og:url" content={data.site.siteMetadata.ogUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={data.site.siteMetadata.ogLocale} />
        <meta property="og:image" content="https://yolife.is/img/yolife-favicon.png" />
        {/* <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" /> */}
        <meta name="twitter:title" content={data.site.siteMetadata.twitterTitle} />
        <meta name="twitter:description" content={data.site.siteMetadata.twitterDescription} />
        <meta name="twitter:image" content="https://yolife.is/img/yolife-favicon.png" />,
      </Helmet>
    )}
  />
)

export default LayoutHelmet
