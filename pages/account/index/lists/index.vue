<template>
  <div>
    <h3 class="title is-3">
      My lists
    </h3>
    <div class="tabs">
      <ul>
        <li>
          <nuxt-link to="/account/lists/public">
            Public lists
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/account/lists/private">
            Private lists
          </nuxt-link>
        </li>
      </ul>
    </div>
    <div>
      <NuxtChild :user="user" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  created() {
    this.$store.dispatch('lists/getUserLists')

    this.$router.push({
      path: '/account/lists/public'
    })
  },
  head() {
    return {
      title: 'My Account - Edit Lists',
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
        { hid: 'og-title', name: 'og:title', content: 'My Account - Edit Lists' }
      ]
    }
  }
}
</script>
