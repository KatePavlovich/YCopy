import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Link } from 'gatsby'
import { HTMLContent } from '../components/Content'
import { Header, BodyContainer, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import TeaserGrid from '../components/TeaserGrid'
import Teaser from '../components/Teaser'
import About from '../components/About'

const preparePosts = (posts) => {
  return posts.edges.map(({ node: { frontmatter: { title, description, image }, fields: { slug, mainTag } } }) => ({
    slug,
    title,
    description,
    image,
    mainTag: {
      title: mainTag.frontmatter.title,
      slug: mainTag.fields.slug,
    },
  }))
}

const renderTagLink = ({ slug, title }) => (style) => (
  <div className={style.tagLink}>
    <Link to={`/tag/${slug}`} aria-label={title}>
      {title}
    </Link>
  </div>
)

const renderPostTeaser = ({ slug, title, image, mainTag }) => (
  <Teaser {...{ to: `/post/${slug}`, title, image, renderTagLink: renderTagLink(mainTag) }} />
)

const AboutTemplate = ({
  data: {
    page: {
      html: content,
      frontmatter: { title, description, seo },
    },
    posts,
  },
}) => {
  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={1} />
        <BodyContainer variant={1} />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

AboutTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
    posts: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default AboutTemplate

export const query = graphql`
  query AboutTemplate {
    page: markdownRemark(frontmatter: { templateKey: { eq: "About" } }) {
      html
      frontmatter {
        title
        description
        seo {
          description
          keywords
        }
      }
    }
    posts: allMarkdownRemark(
      filter: { frontmatter: { templateKey: { glob: "Interview*" }, isPublished: { eq: true } } }
      sort: { fields: [frontmatter___publishDate], order: DESC }
      limit: 6
    ) {
      edges {
        node {
          frontmatter {
            title
            description
            image
          }
          fields {
            slug
            mainTag {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
          }
        }
      }
    }
  }
`