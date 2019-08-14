const dev = !(process.env.NODE_ENV === 'production')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Movie lists to watch',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'keywords', name: 'keywords', keywords: 'Movies, TV Shows, People, Movie Lists, Movie Inspiration, Movie Wishlist, Inspiration List' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffc105' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/index.scss',
    'swiper/dist/css/swiper.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-circle.js', ssr: false },
    { src: '~/plugins/infinite-scroll.js', ssr: false },
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/silentbox.js', ssr: false },
    { src: '~/plugins/filters.js' }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-webfontloader',
    '@nuxtjs/eslint-module',
    'nuxt-sass-resources-loader'
  ],
  /*
  ** SASS Resources
  */
  sassResources: [
    '@/assets/scss/base/variables.sass'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    https: !dev
  },
  /*
  ** Google Fonts
  */
  webfontloader: {
    google: {
      families: ['Rubik:300,400,500,700'] // Loads Lato font with weights 400 and 700
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }
  }
}
