import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import { Footer } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import Guide from '../components/Guide'

import '../styles/general.scss'
import '../styles/swiper.scss'

const prepareGuides = (guides) =>
  guides.edges.map(({ node: { frontmatter: { title, description }, fields: { slug } } }) => ({
    slug,
    title,
    description,
  }))

const prepareGuidePosts = (guidePosts) =>
  guidePosts.map(({ html, fields: { slug }, frontmatter: { title, image, longitude, latitude } }) => ({
    title,
    slug,
    image,
    html,
    longitude,
    latitude,
  }))

const prepareGuidesPage = (guidesPage) => {
  const {
    frontmatter: { title },
  } = guidesPage
  return { title }
}

const GuideTemplate = ({
  location,
  data: {
    page: {
      html,
      frontmatter: { title, image, longitude, latitude, zoom },
      fields: { guidePosts },
    },
    guides,
    guidesPage,
  },
}) => {
  return (
    <Fragment>
      <LayoutHelmet />
      <Guide
        {...{ location, html, title, image, longitude, latitude, zoom }}
        guidesPage={prepareGuidesPage(guidesPage)}
        guidePosts={prepareGuidePosts(guidePosts)}
        guides={prepareGuides(guides)}
      />
      <Footer normal />
    </Fragment>
  )
}

export default GuideTemplate

GuideTemplate.propTypes = {
  location: PropTypes.object,
  data: PropTypes.shape({
    page: PropTypes.object,
    guides: PropTypes.shape({
      edges: PropTypes.array,
    }),
    guidesPage: PropTypes.object,
  }),
}

export const query = graphql`
  query GuideTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        guidePosts {
          html
          frontmatter {
            title
            image
            longitude
            latitude
          }
          fields {
            slug
          }
        }
      }
      frontmatter {
        title
        image
        longitude
        latitude
        zoom
        seo {
          description
          keywords
        }
      }
    }
    guides: allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "Guide" }, isPublished: { eq: true } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          frontmatter {
            title
            description
          }
          fields {
            slug
          }
        }
      }
    }
    guidesPage: markdownRemark(frontmatter: { templateKey: { eq: "Guides" } }) {
      frontmatter {
        title
      }
    }
  }
`
