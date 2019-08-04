<template>
  <div>
    <navbar />

    <section class="main-content ss-content">
      <nuxt />
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p class="is-size-7">
          Created by <a href="https://www.thegeekdeveloper.com" target="_blank">The Geek Developer</a>
        </p>
        <p class="is-size-7">
          This product uses the <a href="https://www.themoviedb.org/documentation/api" target="_blank">TMDb API</a> but is not endorsed or certified by <a href="https://www.themoviedb.org" target="_blank">TMDb</a>.
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
