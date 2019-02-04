import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import uniqBy from 'lodash/uniqBy'
import { compareDesc } from 'date-fns'
import { Link } from 'gatsby'
import { HTMLContent } from '../components/Content'
import TeaserGrid from '../components/TeaserGrid'
import Teaser from '../components/Teaser'
import Interview2 from '../components/Interview2'

const prepareTags = (mainTag, tags) => {
  return uniqBy(
    [
      mainTag,
      ...tags
        .sort(
          ({ frontmatter: { priority: priorityLeft } }, { frontmatter: { priority: priorityRight } }) =>
            priorityLeft - priorityRight,
        )
        .map(({ frontmatter: { title }, fields: { slug } }) => ({
          slug,
          title,
        })),
    ],
    'slug',
  )
}

const renderTagTitle = (slug) => (title) => (
  <Link to={`/tag/${slug}`} aria-label={title}>
    <h1>{title}</h1>
  </Link>
)

const renderPostTeaser = ({ slug, title, image }) => <Teaser {...{ to: `/post/${slug}`, title, image }} />

const Interview2Template = ({
  data: {
    page: {
      html,
      frontmatter: { title, image, author, photographer, illustrator, description, lead, biography, seo },
      fields: {
        slug,
        mainTag: {
          frontmatter: { title: tagTitle, color: tagColor, slidesPerView: tagSlidesPerView },
          fields: { slug: tagSlug, project: tagProject, posts },
        },
        tags,
      },
    },
  },
  pageContext,
}) => {
  const tagPosts = posts
    .filter(({ id, frontmatter: { image } }) => id !== pageContext.id && image)
    .sort(({ frontmatter: { publishDate: dateLeft } }, { frontmatter: { publishDate: dateRight } }) =>
      compareDesc(dateLeft, dateRight),
    )
    .map(({ frontmatter: { title, description, image, publishDate }, fields: { slug } }) => ({
      slug,
      title,
      description,
      image,
      publishDate,
    }))
  const mainTag = { slug: tagSlug, title: tagTitle }
  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={2} />
        <Interview2
          {...{
            title,
            image,
            author,
            photographer,
            illustrator,
            lead,
            description,
            biography,
            content: html,
            contentComponent: HTMLContent,
            tags: prepareTags(mainTag, tags),
            isProjectTag: !!tagProject,
            mainTag,
            seo,
            url: `/post/${slug}`,
          }}
          renderMore={(styles) => (
            <TeaserGrid
              {...{
                className: styles.more,
                title: tagTitle,
                color: tagColor,
                renderTitle: renderTagTitle(tagSlug),
                items: tagProject ? tagPosts : tagPosts.slice(0, +tagSlidesPerView),
                chunk: +tagSlidesPerView,
                renderItem: renderPostTeaser,
              }}
              isInterview2RenderMore
            />
          )}
        />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

Interview2Template.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
  }),
}

export default Interview2Template

export const query = graphql`
  query Interview2Template($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        description
        lead
        author
        photographer
        illustrator
        image
        seo {
          description
          keywords
        }
        biography {
          title
          events {
            year
            event
          }
        }
      }
      fields {
        slug
        mainTag {
          frontmatter {
            title
            color
            slidesPerView
          }
          fields {
            slug
            project {
              frontmatter {
                title
              }
            }
            posts {
              id
              frontmatter {
                title
                publishDate
                description
                image
              }
              fields {
                slug
              }
            }
          }
        }
        tags {
          frontmatter {
            title
            priority
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
