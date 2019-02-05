const mapPagesUrls = {
  Interview1: (node) => `/post/${node.fields.slug}`,
  Interview2: (node) => `/post/${node.fields.slug}`,
  Interview3: (node) => `/post/${node.fields.slug}`,
  About: (node) => '/about',
  Journal: (node) => `/journal/${node.fields.slug}`,
  Guide: (node) => `/guide/${node.fields.slug}`,
  GuidePost: (node, getNode) => `/guide/${getNode(node.fields.guide).fields.slug}#${node.fields.slug}`,
  JournalPost: (node, getNode) => `/journal/${getNode(node.fields.journal).fields.slug}#${node.fields.slug}`,
}

module.exports = {
  siteMetadata: {
    siteUrl: 'https://yolife.is',
    title: 'YoLife.is – вдохновляющее медиа и информационное издание',
    keywords: 'Yoga, health',
    description: 'YoLife.is – вдохновляющее медиа и информационное издание',
    ogSitename: 'Yolife',
    ogTitle: 'YoLife.is – вдохновляющее медиа и информационное издание',
    ogDescription: 'YoLife.is – вдохновляющее медиа и информационное издание',
    ogUrl: 'https://yolife.is/',
    ogLocale: 'ru_RU',
    twitterTitle: 'YoLife.is – вдохновляющее медиа и информационное издание',
    twitterDescription: 'YoLife.is – вдохновляющее медиа и информационное издание',
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-122869524-1',
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [
          {
            name: 'ru',
            filterNodes: (node) => {
              if (!node.frontmatter) return false
              if (node.frontmatter.hasOwnProperty('isPublished') && !node.frontmatter.isPublished) return false
              if (node.frontmatter.templateKey === 'GuidePost' && node.fields.guide === undefined) return false
              if (node.frontmatter.templateKey === 'JournalPost' && node.fields.journal === undefined) return false
              return node.frontmatter.templateKey in mapPagesUrls
            },
          },
        ],
        fields: [
          { name: 'title', store: true },
          { name: 'description', store: true },
          { name: 'content' },
          { name: 'lead' },
          { name: 'url', store: true },
        ],

        resolvers: {
          MarkdownRemark: {
            title: (node) => node.frontmatter.title,
            description: (node) => node.frontmatter.description,
            lead: (node) => node.frontmatter.lead,
            content: (node) => node.rawMarkdownBody,
            url: (node, getNode) => mapPagesUrls[node.frontmatter.templateKey](node, getNode),
          },
        },
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-typography',
            options: {
              locale: ['ru'],
              disableRules: ['common/space/trimRight', 'common/space/trimLeft'],
              fields: ['description', 'lead'],
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-plugin-favicon',
      options: {
        logo: './src/favicons/yolife-favicon.png',

        appName: 'Yolife.is',
        appDescription: 'Yolife.is',
        developerName: 'HUMANSEE LABS',
        developerURL: 'https://humanseelabs.com/',
        dir: 'auto',
        lang: 'en-US',
        background: '#fff',
        theme_color: '#fff',
        display: 'standalone',
        orientation: 'any',
        start_url: '/?homescreen=1',
        version: '1.0',

        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
    },
    `gatsby-transformer-remark`,
    'gatsby-plugin-offline',
    // make sure to put last in the array
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        src: `${__dirname}/src`,
        pages: `${__dirname}/pages`,
      },
    },
    'gatsby-plugin-lodash',
  ],
  mapping: {
    'MarkdownRemark.fields.mainTag': 'MarkdownRemark',
    'MarkdownRemark.fields.tags': 'MarkdownRemark',
    'MarkdownRemark.fields.posts': 'MarkdownRemark',
    'MarkdownRemark.fields.tag': 'MarkdownRemark',
    'MarkdownRemark.fields.project': 'MarkdownRemark',
    'MarkdownRemark.fields.journal': 'MarkdownRemark',
    'MarkdownRemark.fields.journalSet': 'MarkdownRemark',
    'MarkdownRemark.fields.journalPosts': 'MarkdownRemark',
    'MarkdownRemark.fields.journals': 'MarkdownRemark',
    'MarkdownRemark.fields.guidePosts': 'MarkdownRemark',
    'MarkdownRemark.fields.guide': 'MarkdownRemark',
    'MarkdownRemark.fields.hotGuides': 'MarkdownRemark',
    'MarkdownRemark.fields.coverPlaces': 'MarkdownRemark',
  },
}
