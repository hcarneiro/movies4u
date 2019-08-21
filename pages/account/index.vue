<template>
  <div>
    <section class="hero">
      <div class="hero-body ss-account-hero">
        <div class="container">
          <article>
            <figure class="media-left">
              <p class="image is-128x128">
                <img class="is-rounded" :src="user.profilePicture">
              </p>
            </figure>
            <div class="content">
              <h1 class="title">
                {{ user.fullName }}
              </h1>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section class="section ss-profile-section">
      <div class="container">
        <div class="columns">
          <div class="column is-one-fifth">
            <div class="vertical-tabs is-hidden-mobile">
              <ul>
                <li>
                  <nuxt-link to="/account/profile">
                    Edit profile
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/account/lists">
                    My lists
                  </nuxt-link>
                </li>
              </ul>
            </div>

            <div class="tabs is-hidden-tablet">
              <ul>
                <li>
                  <nuxt-link to="/account/profile">
                    Edit profile
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/account/lists">
                    My lists
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="column">
            <NuxtChild :user="user" />
          </div>
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
        return state.auth.currentUser
      }
    })
  },
  methods: {}
}
</script>
