<template>
  <div>
    <navbar />

    <section class="main-content ss-content">
      <nuxt />
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

export default {
  components: {
    Navbar
  }
}
</script>
