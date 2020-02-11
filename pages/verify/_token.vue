<template>
  <div>
    <div class="signedup-wrapper">
      <div v-if="userVerified && !isVerifying" class="ss-callout is-success">
        <h4 class="title is-4">
          Account verified
        </h4>
        <p>Your account was successfully activated.</p>
        <nuxt-link :to="'/'">
          Create your first list
        </nuxt-link>
      </div>
      <div v-if="!userVerified && !isVerifying" class="ss-callout is-danger">
        <h4 class="title is-4">
          Account could not be verified
        </h4>
        <p v-html="error" />
        <p>Please try again using the link sent to your email or contact support.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  head() {
    return {
      title: 'Create account',
      meta: [
        { hid: 'description', name: 'description', content: 'Verify account' },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
  data() {
    return {
      token: this.$route.params.token,
      isVerifying: true,
      userVerified: false,
      error: undefined
    }
  },
  mounted() {
    this.$store.dispatch('auth/verifyUserEmail', this.token)
      .then(() => {
        return this.$store.dispatch('auth/verifyUser', true, true)
      })
      .then(() => {
        this.isVerifying = false
        this.userVerified = true
      })
      .catch((error) => {
        this.error = (error && error.body && error.body.message) || 'Activation failed.'
        this.isVerifying = false
        this.userVerified = false
      })
  }
}
</script>
