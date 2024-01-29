import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import { createClient } from 'contentful'
import { Link, navigate } from 'gatsby';
import React, { useState, useEffect } from 'react'
import Seo from '../../components/seo'
import Layout from '../../components/layout'
import { Post } from '../../typings/models'

const BlogPost = ({ params }: any) => {
  const [post, savePost] = useState({} as Post)
  const [body, saveBody] = useState(null as React.ReactNode)
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
          [INLINES.EMBEDDED_ENTRY]: (node: any) => {
            const { title, slug } = node.data.target.fields
            return <span className="embedded-entry">
              <Link to={`../${slug}`}>{title}</Link>
            </span>
          },
          [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
            const { title, slug } = node.data.target.fields
            return <div className="embedded-entry">
              <div className="embeddded-entry__title">
                <Link to={`../${slug}`}>{title}</Link>
              </div>
            </div>
          },
          [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            const { file, description } = node.data.target.fields
            return (
              <img src={`https://${file.url}`}
                height={file.details.image.height}
                width={file.details.image.width}
                alt={description} />
            )
          },
        }
      }

      saveBody(documentToReactComponents(rawRichTextField, renderOptions))
    }).catch((err) => console.error(err))
  }, [slug]) // query once

  return !post ? '' : (
    <Layout pageTitle={post.fields?.title}>
      <Seo title={post.fields?.title} />

      {body}
    </Layout>
  )
}

export default BlogPost
