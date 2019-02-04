import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import { Footer } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { compareDesc } from 'date-fns'
import Home from '../components/Home'

import '../styles/general.scss'

const prepareProject = (project) => {
  const {
    frontmatter: { title, description, background, logo, isVideoBackgroundEnable, isDecorationEnable },
    fields: {
      tag: {
        fields: { slug, posts },
      },
    },
  } = project
  return {
    title,
    description,
    background,
    logo,
    isVideoBackgroundEnable,
    isDecorationEnable,
    slug,
    posts: posts
      .sort(({ frontmatter: { publishDate: dateLeft } }, { frontmatter: { publishDate: dateRight } }) =>
        compareDesc(dateLeft, dateRight),
      )
      .map(({ frontmatter: { title, icon }, fields: { slug } }) => ({
        title,
        icon,
        slug,
      })),
  }
}

const prepareJournal = (journal) => {
  // если у журнала выставлен флаг isPublished: false, то graphQL запрос его не вернёт
  if (!journal) {
    return null
  }
  const {
    frontmatter: { title, description, label, background, color, style },
    fields: {
      slug,
      journalPosts,
      journalSet: {
        fields: { slug: slugOfJournalSet },
      },
    },
  } = journal
  return {
    title,
    description,
    label,
    background,
    color,
    style,
    slug,
    slugOfJournalSet,
    journalPosts: journalPosts.map(({ frontmatter: { title }, fields: { slug } }) => ({
      title,
      slug,
    })),
  }
}

const prepareTags = (tags, preparedPosts) => {
  const usedPostSlugs = preparedPosts.map(({ slug }) => slug)
  return tags.edges.map(({ node: { frontmatter: { title, slidesPerView, color }, fields: { slug, posts } } }) => {
    return {
      slug,
      title,
      slidesPerView: +slidesPerView,
      color,
      posts: posts
        .sort(({ frontmatter: { publishDate: dateLeft } }, { frontmatter: { publishDate: dateRight } }) =>
          compareDesc(dateLeft, dateRight),
        )
        .reduce(
          (
            accumulator,
            { fields: { slug }, frontmatter: { title, description, isShowDescriptionInTeaser, image } },
          ) => {
            if (usedPostSlugs.find((test) => test === slug)) {
              return accumulator
            }
            usedPostSlugs.push(slug)
            accumulator.push({
              slug,
              title,
              description,
              isShowDescriptionInTeaser,
              image,
            })
            return accumulator
          },
          [],
        ),
    }
  })
}

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

const prepareHotGuides = (hotGuides) => {
  return hotGuides.map(({ frontmatter: { title, icon }, fields: { slug } }) => ({
    title,
    slug,
    icon,
  }))
}

const prepareChannels = ({ edges }) => {
  return edges.map(({ node: { frontmatter: { title, videos }, fields: { slug } } }) => ({
    title,
    slug,
    videos: [...videos].reverse(),
  }))
}

const prepareCoverPlaces = (coverPlaces) => {
  return coverPlaces.map(({ frontmatter: { title, video }, fields: { project } }) => ({
    title,
    video,
    project,
  }))
}

const prepareGuidesPage = (guidesPage) => {
  const {
    frontmatter: { title, description, background, color },
  } = guidesPage
  return { title, description, background, color }
}

const HomeTemplate = ({
  data: {
    page: {
      frontmatter: {
        mainCoversBlock: { composition },
      },
      fields: { journal, project, guidesPage, hotGuides, coverPlaces },
    },
    posts,
    tags,
    channels,
  },
}) => {
  const preparedPosts = preparePosts(posts)
  return (
    <Fragment>
      <LayoutHelmet />
      <Home
        hotPosts={preparedPosts.slice(0, 4)}
        gridPosts={preparedPosts.slice(4)}
        tags={prepareTags(tags, preparedPosts)}
        coverPlaces={prepareCoverPlaces(coverPlaces).reduce((accumulator, { title, video, project }) => {
          accumulator[title] = { video, project: project ? prepareProject(project) : project }
          return accumulator
        }, {})}
        channels={prepareChannels(channels)}
        mainCoversBlock={{
          composition,
          journal: prepareJournal(journal),
          project: prepareProject(project),
          guidesPage: prepareGuidesPage(guidesPage),
          hotGuides: prepareHotGuides(hotGuides),
        }}
      />
      <Footer />
    </Fragment>
  )
}

HomeTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
    posts: PropTypes.shape({
      edges: PropTypes.array,
    }),
    tags: PropTypes.shape({
      edges: PropTypes.array,
    }),
    channels: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const query = graphql`
  query HomeTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        mainCoversBlock {
          composition
        }
      }
      fields {
        project {
          frontmatter {
            title
            description
            background
            logo
            isVideoBackgroundEnable
            isDecorationEnable
          }
          fields {
            tag {
              fields {
                slug
                posts {
                  frontmatter {
                    title
                    icon
                    publishDate
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        }
        journal {
          frontmatter {
            title
            description
            label
            background
            color
            style
          }
          fields {
            slug
            journalSet {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
            journalPosts {
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
          }
        }
        guidesPage {
          frontmatter {
            title
            description
            background
            color
          }
        }
        hotGuides {
          frontmatter {
            title
            icon
          }
          fields {
            slug
          }
        }
        coverPlaces {
          frontmatter {
            title
            video
          }
          fields {
            project {
              frontmatter {
                title
                description
                background
                logo
              }
              fields {
                slug
                tag {
                  fields {
                    slug
                    posts {
                      frontmatter {
                        title
                        icon
                        publishDate
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
        }
      }
    }
    posts: allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { glob: "Interview*" }, isPublished: { eq: true } }
        fields: { isProjectPost: { ne: true } }
      }
      sort: { fields: [frontmatter___publishDate], order: DESC }
      limit: 10
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            templateKey
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
    channels: allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "Channel" } } }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          frontmatter {
            title
            videos {
              title
              url
              duration
            }
          }
          fields {
            slug
          }
        }
      }
    }
    tags: allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { glob: "Tag*" } }
        fields: { project: { eq: null }, isEmpty: { ne: true } }
      }
      sort: { fields: [frontmatter___priority] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slidesPerView
            color
          }
          fields {
            slug
            project {
              frontmatter {
                title
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
    }
  }
`

export default HomeTemplate
