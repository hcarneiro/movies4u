<template>
  <div>
    <div v-if="!signedUp" class="auth-holder signup">
      <h2 class="title">
        Create new account
      </h2>
      <p class="subtitle">
        Welcome to That Movie List!
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
          <b-field label="Email">
            <b-input
              v-model="userEmail"
              type="email"
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
          class="button is-primary signup-btn"
          :class="{ 'is-disabled': isVerifying }"
        >
          <span v-if="isVerifying">Please wait...</span>
          <span v-else>Create account</span>
        </button>
        <div class="ss-social-login">
          <div class="ss-divider">
            <span>
              OR
            </span>
          </div>
          <div class="ss-social-buttons">
            <a
              href="/api/v1/auth/facebook"
            >
              <button
                type="button"
                class="button is-primary is-facebook"
                :class="{ 'is-disabled': isVerifying }"
              >
                <span v-if="isVerifying">Please wait...</span>
                <span v-else>
                  <b-icon
                    icon="facebook"
                    size="is-small"
                  /> Signup with Facebook
                </span>
              </button>
            </a>
            <a
              href="/api/v1/auth/google"
            >
              <button
                type="button"
                class="button is-primary is-google"
                :class="{ 'is-disabled': isVerifying }"
              >
                <span v-if="isVerifying">Please wait...</span>
                <span v-else>
                  <b-icon
                    icon="google"
                    size="is-small"
                  /> Signup with Google
                </span>
              </button>
            </a>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="signedup-wrapper">
      <div class="ss-callout is-success">
        <h4 class="title is-4">
          Just one more step...
        </h4>
        <p>We have sent a verification email to <strong>{{ userEmail }}</strong>.</p>
        <p>Click on the link in the email to confirm your email address.</p>
        <br>
        <p><strong class="has-text-warning">Didn't receive the verification email?</strong><br>Please check your spam.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      firstName: '',
      lastName: '',
      userEmail: '',
      userPassword: '',
      passwordConfirm: '',
      error: undefined,
      isVerifying: false,
      signedUp: false,
      passwordMinLength: 8
    }
  },
  methods: {
    verifyUserData() {
      this.error = undefined
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
  },
  head() {
    return {
      title: 'Create account',
      meta: [
        { hid: 'description', name: 'description', content: 'Account creation' },
        { hid: 'robots', name: 'robots', content: 'index, nofollow' }
      ]
    }
  }
}
</script>
