<template>
  <div>
    <div v-if="!success && !error" class="auth-holder signup">
      <h2 class="title">
        Reset password
      </h2>
      <p class="subtitle">
        Please enter your new password below.
      </p>
      <form v-if="validToken" @submit.prevent="verifyUserData">
        <section>
          <b-field label="New Password">
            <b-input
              v-model="userPassword"
              type="password"
              password-reveal
              required
            />
          </b-field>
          <b-field label="Confirm password">
            <b-input
              v-model="passwordConfirm"
              type="password"
              password-reveal
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
          Password successfully reset
        </h4>
        <p>You can now use the new password to login.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      token: this.$route.params.token,
      userPassword: '',
      passwordConfirm: '',
      error: undefined,
      validToken: false,
      success: false,
      loading: true,
      isResetting: false,
      passwordMinLength: 8
    }
  },
  mounted() {
    this.$store.dispatch('auth/getResetTokenInfo', this.token)
      .then(() => {
        // Great success
        this.loading = false
        this.validToken = true
      })
      .catch((error) => {
        this.error = (error && error.body && error.body.message) || 'There was an error resetting your password. Please try again later.'
        this.loading = false
        this.validToken = false
      })
  },
  methods: {
    verifyUserData() {
      this.error = undefined
      this.success = false
      this.isResetting = true

      if (this.userPassword.length < this.passwordMinLength) {
        this.error = `Your password must have at least ${this.passwordMinLength} characters.`
        this.isResetting = false
        return
      }

      if (this.userPassword !== this.passwordConfirm) {
        this.error = 'Passwords don\'t match, please enter them again.'
        this.isResetting = false
        return
      }

      this.resetPassword()
    },
    resetPassword() {
      this.$store.dispatch('auth/resetPassword', {
        password: this.userPassword,
        token: this.token
      }).then(() => {
        this.isResetting = false
        this.success = true
      }).catch((err) => {
        this.isResetting = false

        if (err.data) {
          this.error = err.data.message
        } else if (err.body) {
          this.error = err.body.message
        } else {
          this.error = 'There was an error resetting your password. Please try again later.'
        }
      })
    }
  },
  head() {
    return {
      title: 'Reset password',
      meta: [
        { hid: 'description', name: 'description', content: 'Reset password' },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
