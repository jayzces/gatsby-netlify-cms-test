exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/\/blog\/[0-9a-zA-Z]+(?:-[0-9a-zA-Z]+)*/)) {
    page.matchPath = "/blog/*"

    // Update the page.
    createPage(page)
  }
}
