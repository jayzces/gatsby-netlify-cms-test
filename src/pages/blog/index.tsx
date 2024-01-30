import { createClient } from 'contentful'
import { Link } from 'gatsby'
import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout'

export default function BlogPage() {
  const [posts, savePosts] = useState(new Array<any>())
  const [total, saveTotal] = useState(0)
  const [page, savePage] = useState(1)
  const [totalPages, saveTotalPages] = useState(1)
  const [assets, saveAssets] = useState({} as any)
  const limit = 3

  useEffect(() => {
    createClient({
      space: process.env.GATSBY_SPACE_ID || '',
      accessToken: process.env.GATSBY_API_KEY || ''
    }).getEntries({
      limit,
      skip: (page - 1) * limit,
      order: '-sys.createdAt', // ignore ts error
      content_type: 'blog'
    }).then((data) => {
      if (!data.items || !data.total) return
      savePosts(data.items)
      saveTotal(data.total)
      saveTotalPages(Math.ceil(data.total / limit))

      // id as identifier
      const transformedAssets = data.includes?.Asset?.reduce((acc, curr) => ({ ...acc, [curr.sys.id]: curr.fields }), {})
      saveAssets(transformedAssets)
    }).catch((err) => console.error(err))
  }, [page]) // query once

  function getImage(imageId: string) {
    const { details, url } = assets[imageId].file
    return <img src={url}
      width={details.image.width}
      height={details.image.height}
      alt={assets[imageId].description}
      className='max-w-md h-auto' />
  }

  function NextButton({ page, totalPages }: { page: number, totalPages: number }) {
    if (page < totalPages)
      return <button onClick={() => savePage(page + 1)}>Next</button>
    return ''
  }

  function PrevButton({ page }: { page: number }) {
    if (page > 1)
      return <button onClick={() => savePage(page - 1)}>Prev</button>
    return ''
  }

  return (
    <Layout pageTitle="Blog">
      <section>
        <h2>Blog Posts</h2>
        <p>{total} Posts</p>

        {posts.map((p) => (
          <div className="blog" key={p.fields.slug}>
            <ul>
              {p.fields?.imagePreview
                ? getImage(p.fields.imagePreview.sys.id)
                : ''}
              <li>
                <Link to={'/blog/' + p.fields.slug}>{p.fields.title}</Link>
              </li>
              {p.fields?.summary ? <li >{p.fields.summary}</li> : ''}
            </ul>
          </div>
        ))}

        <PrevButton page={page} />
        <NextButton page={page} totalPages={totalPages} />

        <p>
          Page {page} of {totalPages}
        </p>
      </section>
    </Layout>
  )
}
