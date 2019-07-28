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
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

const imageMapping = {
  'signup': 'background-image: url("/images/sign-up.jpg")',
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
  }
}
</script>
