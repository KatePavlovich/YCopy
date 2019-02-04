const _ = require('lodash')
const path = require('path')
const { transliterate, slugify } = require('./src/utils/string')
// const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              isPublished
              templateKey
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((error) => console.error(error.toString()))
      throw new Error(result.errors)
    }
    const edges = result.data.allMarkdownRemark.edges
    edges.forEach(({ node: { id, frontmatter: { templateKey, isPublished }, fields: { slug } } }) => {
      let url
      switch (templateKey) {
        case 'Interview1':
          if (!isPublished) return
          url = `post/${slug}`
          break
        case 'Interview2':
          if (!isPublished) return
          url = `post/${slug}`
          break
        case 'Interview3':
          if (!isPublished) return
          url = `post/${slug}`
          break
        case 'Masonry':
          if (!isPublished) return
          url = `post/${slug}`
          break
        case 'Tag':
          if (slug === 'empty') return
          url = `tag/${slug}`
          break
        case 'Home':
          url = '/'
          break
        case 'About':
          url = '/about'
          break
        case 'Advertising':
          url = '/advertising'
          break
        case 'Contacts':
          url = '/contacts'
          break
        case 'LegalInfo':
          url = '/legal-info'
          break
        case 'Journal':
          if (!isPublished) return
          url = `/journal/${slug}`
          break
        case 'JournalSet':
          url = `/journal-set/${slug}`
          break
        case 'Guide':
          if (!isPublished) return
          url = `guide/${slug}`
          break
        case 'Guides':
          url = `/guides`
          break
        default:
          break
      }
      if (url) {
        createPage({
          path: url,
          component: path.resolve(`src/templates/${String(templateKey)}.js`),
          context: {
            id,
          },
        })
      }
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const { title, publishDate } = node.frontmatter
    const slug = slugify(transliterate(title))
    createNodeField({
      name: 'slug',
      node,
      value: slug,
    })
  }
  // fmImagesToRelative(node)
}

exports.onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-leaflet/,
            use: ['null-loader'],
          },
          {
            test: /leaflet/,
            use: ['null-loader'],
          },
        ],
      },
    })
  }
}

exports.onPreExtractQueries = ({ actions, getNodes, getNode }) => {
  const { createNodeField } = actions
  const postsOfTag = new Map()
  const postsOfJournal = new Map()
  const journalsOfJournalSet = new Map()
  const tagsOfPost = new Map()
  const postsOfGuide = new Map()
  const hotGuides = new Map()
  const coverPlaces = new Map()
  const markdownNodes = getNodes().filter((node) => node.internal.type === 'MarkdownRemark')
  const allTags = []
  const projectTagIds = []
  markdownNodes.forEach((node) => {
    switch (node.frontmatter.templateKey) {
      case 'Masonry':
      case 'Interview1':
      case 'Interview2':
      case 'Interview3': {
        const post = node
        if (!post.frontmatter.isPublished) break
        const tag = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) => templateKey === 'Tag' && title === post.frontmatter.mainTag,
        )
        if (tag) {
          createNodeField({
            node: post,
            name: 'mainTag',
            value: tag.id,
          })
          if (!postsOfTag.has(tag)) {
            postsOfTag.set(tag, [])
          }
          if (postsOfTag.get(tag).indexOf(post.id) === -1) {
            postsOfTag.get(tag).push(post.id)
          }
        }
        if (post.frontmatter.tags) {
          post.frontmatter.tags.forEach((item) => {
            const tag = markdownNodes.find(
              ({ frontmatter: { templateKey, title } }) => templateKey === 'Tag' && title === item.tag,
            )
            if (tag) {
              if (!tagsOfPost.has(post)) {
                tagsOfPost.set(post, [])
              }
              tagsOfPost.get(post).push(tag.id)
              if (!postsOfTag.has(tag)) {
                postsOfTag.set(tag, [])
              }
              if (postsOfTag.get(tag).indexOf(post.id) === -1) {
                postsOfTag.get(tag).push(post.id)
              }
            }
          })
        }
        break
      }
      case 'Project': {
        const project = node
        const projectTag = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) => templateKey === 'Tag' && title === project.frontmatter.tag,
        )
        if (projectTag) {
          createNodeField({
            node: project,
            name: 'tag',
            value: projectTag.id,
          })
          createNodeField({
            node: projectTag,
            name: 'project',
            value: project.id,
          })
          projectTagIds.push(projectTag.id)
        }
        break
      }
      case 'Journal': {
        const journal = node
        if (!journal.frontmatter.isPublished) break
        postsOfJournal.set(journal, [])
        if (journal.frontmatter.journalPosts) {
          journal.frontmatter.journalPosts.forEach((item) => {
            const journalPost = markdownNodes.find(
              ({ frontmatter: { templateKey, title } }) => templateKey === 'JournalPost' && title === item.journalPost,
            )
            if (journalPost) {
              createNodeField({
                node: journalPost,
                name: 'journal',
                value: journal.id,
              })
              postsOfJournal.get(journal).push(journalPost.id)
            }
          })
        }
        const journalSet = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) =>
            templateKey === 'JournalSet' && title === journal.frontmatter.journalSet,
        )
        if (journalSet) {
          createNodeField({
            node: journal,
            name: 'journalSet',
            value: journalSet.id,
          })
          if (!journalsOfJournalSet.has(journalSet)) {
            journalsOfJournalSet.set(journalSet, [])
          }
          journalsOfJournalSet.get(journalSet).push(journal.id)
        }
        break
      }
      case 'Guide': {
        const guide = node
        if (!guide.frontmatter.isPublished) break
        const guideTag = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) => templateKey === 'Tag' && title === guide.frontmatter.mainTag,
        )
        if (guideTag) {
          createNodeField({
            node: guide,
            name: 'mainTag',
            value: guideTag.id,
          })
        }
        if (guide.frontmatter.guidePosts) {
          guide.frontmatter.guidePosts.forEach((item) => {
            const guidePost = markdownNodes.find(
              ({ frontmatter: { templateKey, title } }) => templateKey === 'GuidePost' && title === item.guidePost,
            )
            if (guidePost) {
              createNodeField({
                node: guidePost,
                name: 'guide',
                value: guide.id,
              })
              if (!postsOfGuide.has(guide)) {
                postsOfGuide.set(guide, [])
              }
              postsOfGuide.get(guide).push(guidePost.id)
            }
          })
        }
        break
      }
      case 'CoverPlace': {
        const coverPlace = node
        const coverPlaceProject = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) =>
            templateKey === 'Project' && title === coverPlace.frontmatter.project,
        )
        if (coverPlaceProject) {
          createNodeField({
            node: coverPlace,
            name: 'project',
            value: coverPlaceProject.id,
          })
        }
        break
      }
      case 'Home': {
        const home = node
        const homeProject = markdownNodes.find(
          ({ frontmatter: { templateKey, title } }) =>
            templateKey === 'Project' && title === home.frontmatter.mainCoversBlock.project,
        )
        if (homeProject) {
          createNodeField({
            node: home,
            name: 'project',
            value: homeProject.id,
          })
        }
        const homeJournal = markdownNodes.find(
          ({ frontmatter: { templateKey, title, isPublished } }) =>
            templateKey === 'Journal' && title === home.frontmatter.mainCoversBlock.journal && isPublished,
        )
        if (homeJournal) {
          createNodeField({
            node: home,
            name: 'journal',
            value: homeJournal.id,
          })
        }
        const guidesPage = markdownNodes.find(({ frontmatter: { path } }) => path === '/guides')
        if (guidesPage) {
          createNodeField({
            node: home,
            name: 'guidesPage',
            value: guidesPage,
          })
        }
        if (home.frontmatter.mainCoversBlock.hotGuides) {
          home.frontmatter.mainCoversBlock.hotGuides.forEach((item) => {
            const hotGuide = markdownNodes.find(
              ({ frontmatter: { templateKey, title, isPublished } }) =>
                templateKey === 'Guide' && title === item.guide && isPublished,
            )
            if (hotGuide) {
              if (!hotGuides.has(home)) {
                hotGuides.set(home, [])
              }
              hotGuides.get(home).push(hotGuide.id)
            }
          })
        }
        if (home.frontmatter.coverPlaces) {
          home.frontmatter.coverPlaces.forEach((item) => {
            const coverPlace = markdownNodes.find(
              ({ frontmatter: { templateKey, title } }) => templateKey === 'CoverPlace' && title === item.coverPlace,
            )
            if (coverPlace) {
              if (!coverPlaces.has(home)) {
                coverPlaces.set(home, [])
              }
              coverPlaces.get(home).push(coverPlace.id)
            }
          })
        }
        break
      }
      case 'Tag': {
        const tag = node
        allTags.push(tag)
        break
      }
      default: {
        break
      }
    }
  })
  const notEmptyTags = []
  postsOfTag.forEach((postIds, tag) => {
    notEmptyTags.push(tag)
    createNodeField({
      node: tag,
      name: 'posts',
      value: postIds,
    })
  })
  allTags.forEach((tag) => {
    if (notEmptyTags.find((item) => item === tag)) return
    createNodeField({
      node: tag,
      name: 'isEmpty',
      value: true,
    })
    createNodeField({
      node: tag,
      name: 'posts',
      value: [],
    })
  })
  tagsOfPost.forEach((tagIds, post) => {
    createNodeField({
      node: post,
      name: 'tags',
      value: tagIds,
    })
    if (_.intersection(projectTagIds, tagIds).length > 0) {
      createNodeField({
        node: post,
        name: 'isProjectPost',
        value: true,
      })
    }
  })
  postsOfJournal.forEach((journalPostIds, journal) => {
    createNodeField({
      node: journal,
      name: 'journalPosts',
      value: journalPostIds,
    })
  })
  journalsOfJournalSet.forEach((journalIds, journalSet) => {
    createNodeField({
      node: journalSet,
      name: 'journals',
      value: journalIds,
    })
  })
  postsOfGuide.forEach((guidePostIds, guide) => {
    createNodeField({
      node: guide,
      name: 'guidePosts',
      value: guidePostIds,
    })
  })
  hotGuides.forEach((hotGuideIds, home) => {
    createNodeField({
      node: home,
      name: 'hotGuides',
      value: hotGuideIds,
    })
  })
  coverPlaces.forEach((coverPlaceIds, home) => {
    createNodeField({
      node: home,
      name: 'coverPlaces',
      value: coverPlaceIds,
    })
  })
}
