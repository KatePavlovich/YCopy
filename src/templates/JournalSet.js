import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import JournalSet from '../components/JournalSet'

const JournalSetTempate = ({
  data: {
    page: {
      frontmatter: { title },
      fields: { slug, journals },
    },
  },
}) => {
  if (!journals) {
    return null
  }

  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={1} />
        <JournalSet
          {...{ title, slug }}
          journals={journals.map(
            ({ frontmatter: { title, description, label, background, color, style }, fields }) => ({
              slugOfJournalSet: slug,
              title,
              description,
              label,
              background,
              color,
              style,
              slug: fields.slug,
              journalPosts: fields.journalPosts.map(({ frontmatter: { title }, fields: { slug } }) => ({
                title,
                slug,
              })),
            }),
          )}
        />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

JournalSetTempate.propTypes = {
  data: PropTypes.shape({
    journalSet: PropTypes.object,
  }),
}

export default JournalSetTempate

export const query = graphql`
  query JournalSetTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
      }
      fields {
        slug
        journals {
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
      }
    }
  }
`
