import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { createClient } from 'contentful'
import { navigate } from 'gatsby';
import React, { useState, useEffect } from 'react'
import Seo from '../../components/seo'
import Layout from '../../components/layout'
import { Post } from '../../typings/models'

const BlogPost = ({ params }: any) => {
  const [post, savePost] = useState({} as Post)
  const [body, saveBody] = useState('')
  const slug = params['*']

  useEffect(() => {
    createClient({
      space: process.env.GATSBY_SPACE_ID || '',
      accessToken: process.env.GATSBY_API_KEY || ''
    }).getEntries({
      content_type: 'blog',
      'fields.slug': slug,
    }).then((data) => {
      const entry = data.items[0]

      if (!entry || !entry.fields || !entry.fields.body) {
        navigate('/404')
        return
      }

      savePost(entry as any)

      // generated rendered html
      const rawRichTextField: any = entry.fields.body
      const renderOptions: Partial<Options> = {
        renderNode: {
          // html only, not jsx
          [INLINES.EMBEDDED_ENTRY]: (node: any) => {
            const { title, slug } = node.data.target.fields
            return `<div class="inline-entry">
              <div class="inline-entry__title">
                <a href="/blog/${slug}">${title}</a>
              </div>
            </div>`
          },
          [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
            const { title, slug } = node.data.target.fields
            return `<div class="embedded-entry">
              <div class="embeddded-entry__title">
                <a href="/blog/${slug}">${title}</a>
              </div>
            </div>`
          },
          [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const { file, description } = node.data.target.fields
            const src = `https://${file.url}`
            const height = file.details.image.height
            const width = file.details.image.width
            const alt = description
            return `<img src="${src}" height="${height}" width="${width}" alt="${alt}" />`
          },
        }
      }

      saveBody(documentToHtmlString(rawRichTextField, renderOptions))
    }).catch((err) => console.error(err))
  }, []) // query once

  return !post ? '' : (
    <Layout pageTitle={post.fields?.title}>
      <Seo title={post.fields?.title} />

      <div dangerouslySetInnerHTML={{
        __html: body
      }}></div>
    </Layout>
  )
}

export default BlogPost
