<template>
  <div>
    <div v-if="!success && !error" class="auth-holder signup">
      <h2 class="title">
        Reset your password
      </h2>
      <p class="subtitle">
        Enter your email address below, and we will send you an email to reset your password.
      </p>
      <form @submit.prevent="forgotPassword">
        <section>
          <b-field label="Email">
            <b-input
              v-model="userEmail"
              type="email"
              required
            />
          </b-field>
        </section>
        <div v-if="error" class="bd-callout bd-callout-danger">
          {{ error }}
        </div>
        <button
          class="button is-primary signup-btn"
          :class="{ 'is-disabled': isResetting }"
        >
          <span v-if="isResetting">Please wait...</span>
          <span v-else>Reset password</span>
        </button>
      </form>
    </div>
    <div v-else class="signedup-wrapper">
      <div v-if="error" class="ss-callout is-danger" v-html="error" />
      <div v-if="success" class="ss-callout is-success">
        <h4 class="title is-4">
          Just one more step...
        </h4>
        <p>Click on the link in the email sent to <strong>{{ userEmail }}</strong> to reset your password.</p>
        <br>
        <p><strong class="has-text-warning">Didn't receive the password reset email?</strong><br>Please check your spam.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  head() {
    return {
      title: 'Reset password',
      meta: [
        { hid: 'description', name: 'description', content: 'Forgot password' },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },
  data() {
    return {
      userEmail: '',
      error: undefined,
      success: false,
      isResetting: false
    }
  },
  methods: {
    forgotPassword() {
      this.error = undefined
      this.success = false
      this.isResetting = true

      this.$store.dispatch('auth/forgotPassword', this.userEmail.trim().toLowerCase()).then(() => {
        this.isResetting = false
        this.success = true
      }).catch((err) => {
        this.isResetting = false

        if (err.data) {
          this.error = err.data.message
        } else if (err.body) {
          this.error = err.body.message
        } else if (err.response && err.response.data) {
          this.error = err.response.data.message
        } else {
          this.error = 'Invalid email address.'
        }
      })
    }
  }
}
</script>
