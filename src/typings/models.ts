export interface Post {
  fields: {
    title: string,
    slug: string,
    summary?: string,
    body: {
      content: Content[],
    },
    imagePreview?: {
      sys: {
        id: string,
      }
    }
  }
}

export interface Content {
  nodeType: string,
  content: {
    value: string
  }[]
}
