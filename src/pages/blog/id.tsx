import { createClient } from 'contentful'
import React, { useState, useEffect } from 'react'
import Seo from '../../components/seo'
import { Post } from '../../typings/models'
import Layout from '../../components/layout'

const BlogPost = ({ params }: any) => {
  const [post, savePost] = useState({} as Post)
  const client = createClient({
    space: process.env.GATSBY_SPACE_ID || '',
    accessToken: process.env.GATSBY_API_KEY || ''
  })
  const slug = params['*']

  useEffect(() => {
    client.getEntries({
      content_type: 'blog',
      'fields.slug': slug,
    }).then((data) => {
      const _post = data.items[0]
      if (!post) return
      savePost(_post as any)
    })
  }, []) // query once

  return !post ? '' : (
    <Layout pageTitle={post.fields?.title}>
      <Seo title={post.fields?.title} />
    </Layout>
  )
}

export default BlogPost
