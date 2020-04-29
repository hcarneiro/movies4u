export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  app.router.afterEach((to, from) => {
    /*
    ** We tell Google Analytics to add a `pageview`
    */
    window.gtag('config', 'UA-164975966-1', {
      'page_title': to.name,
      'page_path': to.fullPath
    })
  })
}
