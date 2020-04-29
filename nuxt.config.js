const dev = !(process.env.NODE_ENV === 'production')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - That Movie List',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Your source for movie inspiration to watch. Create your movie lists, share them with others, and use the community\'s lists for inspiration.' },
      { hid: 'keywords', name: 'keywords', keywords: 'Movies, TV Shows, People, Movie Lists, Movie Inspiration, Movie Wishlist, Inspiration List' },
      { hid: 'robots', name: 'robots', content: 'index, follow' },
      { hid: 'og-title', name: 'og:title', content: '%s - That Movie List' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'That Movie List' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#ffc105',
    failedColor: '#ff3860'
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/index.scss',
    'swiper/dist/css/swiper.css',
    'vue-multiselect/dist/vue-multiselect.min.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-circle.js', ssr: false },
    { src: '~/plugins/infinite-scroll.js', ssr: false },
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/silentbox.js', ssr: false },
    { src: '~/plugins/vue-select.js', ssr: false },
    { src: '~/plugins/vue-sharing.js', ssr: false },
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
    'nuxt-sass-resources-loader',
    ['nuxt-cookie-control', {
      barPosition: 'bottom-right',
      blockIframe: true,
      colors: {
        barTextColor: '#fff',
        barBackground: '#005771',
        barButtonColor: '#333333',
        barButtonBackground: '#ffc105',
        barButtonHoverColor: '#333333',
        barButtonHoverBackground: '#cc9a04',
        modalButtonBackground: '#ffc105',
        modalButtonHoverColor: '#333333',
        controlButtonBackground: '#005771',
        controlButtonHoverBackground: '#cc9a04',
        controlButtonIconHoverColor: '#fff',
        controlButtonIconColor: '#333333',
        modalButtonHoverBackground: '#cc9a04',
        checkboxActiveBackground: '#ede1e1',
        checkboxInactiveBackground: '#ede1e1',
        checkboxActiveCircleBackground: '#00c58e',
        checkboxInactiveCircleBackground: '#f44336',
        checkboxDisabledBackground: '#dddddd',
        checkboxDisabledCircleBackground: '#ffffff'
      },
      text: {
        barTitle: 'Cookie consent',
        barDescription: 'We use cookies and other tracking technologies to improve your browsing experience on our site, analyze site traffic, and understand where our audiences come from. By choosing Accept all, you consent to our use of cookies and other tracking technologies.'
      }
    }],
    '@nuxtjs/sitemap'
  ],

  cookies: {
    necessary: [
      {
        name: {
          en: 'Default cookies'
        },

        description: {
          en: "Used for remembering user's login."
        },
        cookies: ['auth_token', '_auth_token', 'cookie_control_consent', 'cookie_control_enabled_cookies']
      }
    ],
    optional: [
      {
        name: {
          en: 'Google Analytics'
        },
        description: {
          en:
            'Google Analytics is a web analytics service offered by Google that tracks and reports website traffic.'
        },
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-164975966-1',
        async: true,
        cookies: ['_ga', '_gat_gtag_UA-164975966-1', '_gid'],
        accepted: () => {
          window.dataLayer = window.dataLayer || []
          function gtag() { dataLayer.push(arguments) }
          gtag('js', new Date())

          gtag('config', 'UA-164975966-1')
        }
      }
    ]
  },
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
    baseURL: dev ? 'http://localhost:3000' : 'https://www.thatmovielist.com',
    https: !dev
  },
  /*
  ** Meta configuration
  */
  meta: {
    twitterCard: 'summary',
    ogSiteName: 'That Movie List'
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
  ** Router configurations
  */
  router: {
    middleware: 'auth'
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
