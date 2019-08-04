<template>
  <nav
    class="navbar header ss-navbar"
    :class="{ 'is-scrolled': isScrolled }"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <nuxt-link to="/" class="navbar-item">
        <img
          src="~assets/logo.png"
          alt="Logo"
        >
      </nuxt-link>

      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="ss-main-menu"
        :class="{ 'is-active': burgerIsActive }"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div id="ss-main-menu" class="navbar-menu" :class="{ 'is-active': burgerIsActive }">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <nuxt-link to="/movies" class="navbar-link">
            Movies
          </nuxt-link>

          <div class="navbar-dropdown">
            <nuxt-link to="/movies" class="navbar-item">
              Popular
            </nuxt-link>
            <nuxt-link to="/movies/top-rated" class="navbar-item">
              Top Rated
            </nuxt-link>
            <nuxt-link to="/movies/upcoming" class="navbar-item">
              Upcoming
            </nuxt-link>
            <nuxt-link to="/movies/now-playing" class="navbar-item">
              Now Playing
            </nuxt-link>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <nuxt-link to="/tv" class="navbar-link">
            TV Shows
          </nuxt-link>

          <div class="navbar-dropdown">
            <nuxt-link to="/tv" class="navbar-item">
              Popular
            </nuxt-link>
            <nuxt-link to="/tv/top-rated" class="navbar-item">
              Top rated
            </nuxt-link>
            <nuxt-link to="/tv/on-tv" class="navbar-item">
              On TV
            </nuxt-link>
            <nuxt-link to="/tv/airing-today" class="navbar-item">
              Airing Today
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <b-dropdown v-if="!userAuthenticated" position="is-bottom-left" aria-role="menu">
          <a
            slot="trigger"
            class="navbar-item"
            role="button"
          >
            <span>Login</span>
            <b-icon icon="menu-down is-hidden-touch" />
          </a>

          <b-dropdown-item aria-role="menu-item" custom paddingless>
            <form @submit.prevent="login">
              <div class="modal-card login-form">
                <section class="modal-card-body">
                  <b-field label="Email">
                    <b-input
                      v-model="email"
                      type="email"
                      placeholder="Your email"
                      required
                    />
                  </b-field>

                  <b-field label="Password">
                    <b-input
                      v-model="password"
                      type="password"
                      password-reveal
                      placeholder="Your password"
                      required
                    />
                  </b-field>

                  <b-checkbox v-model="remember">
                    Remember me
                  </b-checkbox>
                </section>
                <footer class="modal-card-foot">
                  <div class="ss-local-login">
                    <button
                      class="button is-primary"
                      :class="{ 'is-disabled': isAuthenticating }"
                    >
                      <span v-if="isAuthenticating">Please wait...</span>
                      <span v-else>Login</span>
                    </button>
                    <nuxt-link tag="a" :to="'/forgot-password'">
                      Forgot password?
                    </nuxt-link>
                  </div>

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
                          :class="{ 'is-disabled': isAuthenticating }"
                        >
                          <span v-if="isAuthenticating">Please wait...</span>
                          <span v-else>
                            <b-icon
                              icon="facebook"
                              size="is-small"
                            /> Login with Facebook
                          </span>
                        </button>
                      </a>
                      <a
                        href="/api/v1/auth/google"
                      >
                        <button
                          type="button"
                          class="button is-primary is-google"
                          :class="{ 'is-disabled': isAuthenticating }"
                        >
                          <span v-if="isAuthenticating">Please wait...</span>
                          <span v-else>
                            <b-icon
                              icon="google"
                              size="is-small"
                            /> Login with Google
                          </span>
                        </button>
                      </a>
                    </div>
                  </div>
                </footer>
              </div>
            </form>
          </b-dropdown-item>
        </b-dropdown>
        <a v-else class="navbar-item" @click.prevent="logout">
          Logout
        </a>
        <nuxt-link v-if="!userAuthenticated" to="/signup" class="navbar-item">
          Signup
        </nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isScrolled: false,
      burgerIsActive: false,
      menuLinks: '.navbar-item, navbar-link',
      email: '',
      password: '',
      error: undefined,
      isAuthenticating: false,
      remember: false
    }
  },
  computed: {
    ...mapState({
      user: (state) => {
        return state.auth.currentUser
      },
      userAuthenticated: (state) => {
        return state.auth.authenticated
      }
    })
  },
  mounted() {
    this.attachHandlers()
  },
  methods: {
    burgerMenuHandler() {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach((el) => {
          el.addEventListener('click', () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target
            const $target = document.getElementById(target)

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active')
            $target.classList.toggle('is-active')
          })
        })
      }
    },
    onScroll() {
      const top = window.pageYOffset

      if (top >= 20) {
        this.isScrolled = true
      } else {
        this.isScrolled = false
      }
    },
    attachHandlers() {
      this.burgerMenuHandler()
      window.addEventListener('scroll', this.onScroll)
    },
    login() {
      if (this.isAuthenticating) {
        return
      }

      this.isAuthenticating = true
      this.error = ''

      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
        remember: this.remember,
        session: true
      })
        .then(() => {
          return this.$store.dispatch('auth/verifyUser', true)
        })
        .then(() => {
          this.isAuthenticating = false
          this.$router.push({
            path: '/'
          })
        })
        .catch((response) => {
          this.isAuthenticating = false

          if (!response) {
            this.error = 'Could not authenticate. Please try later.'
            return
          }

          if (response.data) {
            this.error = response.data.message
          } else if (response.response && response.response.data) {
            this.error = response.response.data.message
          } else {
            this.error = 'Could not authenticate. Please try later.'
          }
        })
    },
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
