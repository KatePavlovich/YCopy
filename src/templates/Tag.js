import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { compareDesc } from 'date-fns'
import Tag from '../components/Tag'
import { graphql } from 'gatsby'

const preparePosts = (posts) => {
  return posts
    .sort(({ frontmatter: { publishDate: dateLeft } }, { frontmatter: { publishDate: dateRight } }) =>
      compareDesc(dateLeft, dateRight),
    )
    .map(({ frontmatter: { title, description, isShowDescriptionInTeaser, image }, fields: { slug } }) => ({
      title,
      description,
      isShowDescriptionInTeaser,
      image,
      slug,
    }))
}

const prepareProject = (project) => {
  if (project && project.frontmatter) {
    return project.frontmatter.background
  }
}

const TagTemplate = ({
  data: {
    page: {
      frontmatter: { title, color, slidesPerView },
      fields: { posts, project },
    },
  },
}) => {
  // TODO use page.slidesPerView for amount of posts per row in grid
  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={1} />
        <Tag
          {...{
            image: prepareProject(project),
            title,
            color,
            chunk: +slidesPerView,
            posts: preparePosts(posts),
          }}
        />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

TagTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
  }),
}

export default TagTemplate

export const query = graphql`
  query TagTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        color
        slidesPerView
        background
      }
      fields {
        slug
        project {
          frontmatter {
            title
            background
          }
        }
        posts {
          frontmatter {
            title
            description
            isShowDescriptionInTeaser
            image
            publishDate
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
