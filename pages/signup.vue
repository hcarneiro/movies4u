<template>
  <div>
    <div v-if="!signedUp" class="auth-holder signup">
      <h2 class="title">
        Sign up
      </h2>
      <p class="subtitle">
        Welcome to {PROJECT NAME}!
      </p>
      <form @submit.prevent="verifyUserData">
        <section>
          <b-field label="First name">
            <b-input
              v-model="firstName"
              type="text"
              required
            />
          </b-field>
          <b-field label="Last name">
            <b-input
              v-model="lastName"
              type="text"
              required
            />
          </b-field>
          <b-field label="Password">
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
          class="button is-primary"
          :class="{ 'is-disabled': isVerifying }"
        >
          <span v-if="isVerifying">Please wait...</span>
          <span v-else>Sign up</span>
        </button>
      </form>
    </div>
    <div v-else class="signedup-wrapper">
      <div class="bd-callout bd-callout-info">
        <h4>Just one more step...</h4>
        <p>We have sent a verification email to <strong>{{ userEmail }}</strong>.</p>
        <p>Click on the link in the email to confirm your email address.</p>
        <p><strong class="text-warning">Didn't receive the verification email?</strong><br>Please check your spam or check with your IT team.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  head() {
    return {
      title: 'Signup'
    }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      userEmail: '',
      userPassword: '',
      passwordConfirm: '',
      error: '',
      isVerifying: false,
      signedUp: false,
      passwordMinLength: 8
    }
  },
  methods: {
    verifyUserData() {
      this.error = false
      this.isVerifying = true

      if (this.userPassword.length < this.passwordMinLength) {
        this.error = `Your password must have at least ${this.passwordMinLength} characters.`
        this.isVerifying = false
        return
      }

      if (this.userPassword !== this.passwordConfirm) {
        this.error = 'Passwords don\'t match, please enter them again.'
        this.isVerifying = false
        return
      }

      this.signup()
    },
    signup() {
      this.$store.dispatch('auth/signUp', {
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.userPassword,
        email: this.userEmail
      }).then(() => {
        this.isVerifying = false
        this.signedUp = true
      }).catch((err) => {
        this.isVerifying = false
        this.error = err.response.data.message
      })
    }
  }
}
</script>
