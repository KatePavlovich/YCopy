import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import { graphql } from 'gatsby'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import Guides from '../components/Guides'

const prepareGuides = (guides) => {
  return guides.edges.map(({ node: { frontmatter: { title, image }, fields: { slug } } }) => ({
    slug,
    title,
    image,
  }))
}

const GuidesTemplate = ({
  data: {
    page: {
      frontmatter: { title, seo },
    },
    guides,
  },
}) => {
  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={1} />
        <Guides {...{ title, seo, guides: prepareGuides(guides), chunk: 3 }} />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

GuidesTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
    guides: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default GuidesTemplate

export const query = graphql`
  query GuidesTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
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
            image
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
