<template>
  <div>
    <section class="hero">
      <div class="hero-body ss-account-hero">
        <div class="container">
          <article class="media">
            <figure class="media-left">
              <p class="image is-128x128">
                <img class="is-rounded" :src="user.profilePicture">
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <h1 class="title">
                  {{ user.fullName }}
                </h1>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: 'My Account',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      user: (state) => {
        console.log(state.auth.currentUser)
        return state.auth.currentUser
      }
    })
  },
  methods: {}
}
</script>
