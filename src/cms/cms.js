import CMS from 'netlify-cms'

import AboutPreviewTemplate from './preview-templates/About'
import Interview1PreviewTemplate from './preview-templates/Interview1'
import Interview2PreviewTemplate from './preview-templates/Interview2'
import Interview3PreviewTemplate from './preview-templates/Interview3'
import ChannelPreviewTemplate from './preview-templates/Channel'

CMS.registerPreviewStyle('/styles.css')
CMS.registerPreviewTemplate('about', AboutPreviewTemplate)
CMS.registerPreviewTemplate('interview1', Interview1PreviewTemplate)
CMS.registerPreviewTemplate('interview2', Interview2PreviewTemplate)
CMS.registerPreviewTemplate('interview3', Interview3PreviewTemplate)
CMS.registerPreviewTemplate('channels', ChannelPreviewTemplate)

CMS.registerEditorComponent({
  id: 'youtube',
  label: 'Youtube',
  fields: [{ name: 'id', label: 'Youtube Video ID', widget: 'string' }],
  pattern: /^<span><div class="yo-youtube"><iframe src="\/\/www.youtube.com\/embed\/(.*)" frameborder="0" allowfullscreen><\/iframe><\/div><\/span>/,
  fromBlock: function(match) {
    console.log(match)
    return {
      id: match[1],
    }
  },
  toBlock: function(obj) {
    return `<span><div class="yo-youtube"><iframe src="//www.youtube.com/embed/${
      obj.id
    }" frameborder="0" allowfullscreen></iframe></div></span>`
  },
  toPreview: function(obj) {
    return `<span><div class="yo-youtube"><iframe src="//www.youtube.com/embed/${
      obj.id
    }" frameborder="0" allowfullscreen></iframe></div></span>`
  },
})

CMS.registerEditorComponent({
  // Internal id of the component
  id: 'fullWidthImage',
  // Visible label
  label: 'Full width image',
  // Fields the user need to fill out when adding an instance of the component
  fields: [{ name: 'image', label: 'Image', widget: 'image' }],
  // Pattern to identify a block as being an instance of this component
  pattern: /^<span><div class="yo-gallery"><img src="(.*)" alt="" \/><\/div><\/span>/,

  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      image: match[1],
    }
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return `<span><div class="yo-gallery"><img src="${obj.image}" alt="" /></div></span>`
  },
  toPreview: function(obj) {
    return `<span><div class="yo-gallery"><img src="${obj.image}" alt="" /></div></span>`
  },
})

CMS.registerEditorComponent({
  // Internal id of the component
  id: 'twoImages',
  // Visible label
  label: 'Two images',
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    { name: 'image1', label: 'Image 1', widget: 'image' },
    { name: 'image2', label: 'Image 2', widget: 'image' },
  ],
  // Pattern to identify a block as being an instance of this component
  pattern: /^<span><div class="yo-gallery-2"><img src="(.*)" alt="" \/><img src="(.*)" alt="" \/><\/div><\/span>/,

  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      image1: match[1],
      image2: match[2],
    }
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return `<span><div class="yo-gallery-2"><img src="${obj.image1}" alt="" /><img src="${
      obj.image2
    }" alt="" /></div></span>`
  },
  toPreview: function(obj) {
    return `<span><div class="yo-gallery-2"><img src="${obj.image1}" alt="" /><img src="${
      obj.image2
    }" alt="" /></div></span>`
  },
})
