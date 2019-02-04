import React, { Fragment } from 'react'
import { Header, Footer, UtilityWrapper } from '../components/Layout'
import LayoutHelmet from '../components/LayoutHelmet'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Journal from '../components/Journal'

import '../styles/general.scss'
import '../styles/swiper.scss'

const prepareJournalPosts = (journalSet, journalPosts) => {
  return journalPosts.map(
    ({
      html,
      frontmatter: { title, description, persona, image, author, photographer, footnote },
      fields: { slug },
    }) => {
      return {
        html,
        title,
        description,
        persona,
        image,
        author,
        photographer,
        footnote,
        slug,
        journalSet: {
          ...journalSet.frontmatter,
          ...journalSet.fields,
        },
      }
    },
  )
}

const JournalTemplate = ({
  data: {
    page: {
      frontmatter: { title, description, label, background, color, style },
      fields: { journalSet, journalPosts },
    },
  },
  location,
}) => {
  return (
    <Fragment>
      <LayoutHelmet />
      <UtilityWrapper>
        <Header variant={1} />
        <Journal
          {...{
            title,
            description,
            label,
            location,
            journalPosts: prepareJournalPosts(journalSet, journalPosts),
            slugOfJournalSet: journalSet.fields.slug,
            background,
            color,
            style,
          }}
        />
      </UtilityWrapper>
      <Footer />
    </Fragment>
  )
}

JournalTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object,
  }),
}

export default JournalTemplate

export const query = graphql`
  query JournalTemplate($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        description
        label
        background
        color
        style
      }
      fields {
        journalSet {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
        journalPosts {
          html
          frontmatter {
            title
            description
            persona
            image
            author
            photographer
            footnote
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
