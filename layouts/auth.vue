<template>
  <div>
    <navbar />

    <section class="main-content ss-content ss-auth-page" :style="backgroundImage">
      <div class="ss-auth-holder">
        <div class="ss-auth-panel">
          <nuxt />
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p class="is-size-7 ss-tmdb-holder">
          <a href="https://www.themoviedb.org" target="_blank"><img src="~assets/tmdb-logo.svg" width="100" alt="The Movie DB"></a>
        </p>
        <p class="is-size-7">
          Created by <a href="https://www.thegeekdeveloper.com" target="_blank">The Geek Developer</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

const imageMapping = {
  signup: 'background-image: url("/images/sign-up.jpg")',
  'forgot-password': 'background-image: url("/images/forgot-password.jpg")',
  'verify-token': 'background-image: url("/images/verify-token.jpg")',
  'reset-password-token': 'background-image: url("/images/reset.jpg")'
}
export default {
  components: {
    Navbar
  },
  data() {
    return {
      backgroundImage: imageMapping.login
    }
  },
  watch: {
    $route(route) {
      this.backgroundImage = imageMapping[route.name]
    }
  },
  created() {
    this.backgroundImage = imageMapping[this.$route.name]
  },
  mounted() {
    document.body.classList.add('is-light')
  },
  destroyed() {
    document.body.classList.remove('is-light')
  }
}
</script>
