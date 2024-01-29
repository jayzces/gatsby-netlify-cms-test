
import { createClient } from 'contentful'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import React, { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'

const IndexPage = () => {
  const [posts, savePosts] = useState(new Array<any>())
  const [total, saveTotal] = useState(0)
  const client = createClient({
    space: process.env.GATSBY_SPACE_ID || '',
    accessToken: process.env.GATSBY_API_KEY || ''
  })

  useEffect(() => {
    client.getEntries({
      limit: 3,
      order: '-sys.createdAt', // ignore ts error
      content_type: 'blog'
    })
      .then((data) => {
        savePosts(data.items)
        saveTotal(data.total)
      })
      .catch((err) => console.error(err))
  }, []) // query once

  return (
    <Layout pageTitle="Home Page">
      <p>I'm making this by following the Gatsby Tutorial.</p>
      <StaticImage
        alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
        src="https://pbs.twimg.com/media/E1oMV3QVgAIr1NT?format=jpg&name=large"
      />

      <section>
        <h2>Blog Posts</h2>
        {total} Posts

        {posts.map((p) => (
          <div className="blog" key={p.fields.slug}>
            <ul>
              <li>
                <Link to={'/blog/' + p.fields.slug}>{p.fields.title}</Link>
              </li>
              {p.fields.summary ? <li >{p.fields.summary}</li> : ''}
            </ul>
          </div>
        ))}
      </section>
    </Layout>
  )
}

export const Head = () => <Seo title="Home Page" />

export default IndexPage
