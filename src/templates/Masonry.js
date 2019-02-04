import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import uniqBy from 'lodash/uniqBy'
import { compareDesc } from 'date-fns'
import { Link } from 'gatsby'
import TeaserGrid from '../components/TeaserGrid'
import Teaser from '../components/Teaser'
import Masonry from '../components/Masonry'

const prepareImages = (images) => {
  return images.map(({ image, width, height, ...opts }) => ({
    src: image,
    width: parseInt(width, 10),
    height: parseInt(height, 10),
    ...opts,
  }))
}

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

const MasonryTemplate = ({
  data: {
    page: {
      frontmatter: { title, image, photographer, illustrator, lead, images, seo },
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
        <Header variant={1} />
        <Masonry
          {...{
            title,
            image,
            photographer,
            illustrator,
            lead,
            images: prepareImages(images),
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
              isMasonryRenderMore
            />
          )}
        />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

MasonryTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
  }),
}

export default MasonryTemplate

export const query = graphql`
  query MasonryTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        lead
        photographer
        illustrator
        image
        seo {
          description
          keywords
        }
        images {
          image
          caption
          width
          height
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
