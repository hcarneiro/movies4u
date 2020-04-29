<template>
  <div>
    <navbar />

    <section class="main-content ss-content">
      <nuxt />
      <list-form-modal />
      <share-modal />
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p class="is-size-7 ss-tmdb-holder">
          <a href="https://www.themoviedb.org" target="_blank"><img src="~assets/tmdb-logo.svg" width="100" alt="The Movie DB"></a>
        </p>
        <p class="is-size-7">
          Created by <a href="https://www.thegeekdeveloper.com" target="_blank">The Geek Developer</a>
        </p>
        <p class="is-size-7">
          <a href="https://www.thatmovielist.com/terms-and-conditions/">Terms and Conditions</a> | <a href="https://www.thatmovielist.com/privacy/">Privacy</a>
        </p>
      </div>
    </footer>

    <CookieControl />
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import ListFormModal from '~/components/ListFormModal'
import ShareModal from '~/components/ShareModal'

export default {
  components: {
    Navbar,
    ListFormModal,
    ShareModal
  }
}
</script>
