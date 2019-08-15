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
        ref="navburger"
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

    <div id="ss-main-menu" ref="mainmenu" class="navbar-menu" :class="{ 'is-active': burgerIsActive }">
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
        <div class="navbar-item search-bar">
          <no-ssr>
            <multiselect
              id="ajax"
              v-model="selectedResult"
              label="title"
              track-by="id"
              placeholder="Search for a movie or tv show"
              open-direction="bottom"
              :custom-label="customLabel"
              :show-labels="false"
              :options="results"
              :multiple="false"
              :searchable="true"
              :loading="isLoading"
              :options-limit="20"
              :show-no-results="true"
              :reset-after="true"
              @select="onSelect"
              @search-change="onSearch"
            >
              <template slot="singleLabel" slot-scope="props">
                <span class="option__desc">
                  <span class="option__title">{{ props.option.title }}</span>
                </span>
              </template>
              <template slot="option" slot-scope="props">
                <div class="option__desc">
                  <span class="option__title">{{ props.option.title }} ({{ props.option | movieDate | yearOnly }})</span>
                  <span class="option__small">in <span>{{ props.option.media_type }}</span></span>
                </div>
              </template>
              <span slot="noResult">Nothing found!</span>
            </multiselect>
          </no-ssr>
        </div>
        <b-dropdown v-if="!userAuthenticated" position="is-bottom-left" aria-role="menu">
          <a
            slot="trigger"
            class="navbar-item login-btn"
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
        <div v-else class="navbar-item has-dropdown is-hoverable">
          <nuxt-link to="/account" class="navbar-link">
            <div v-if="user && user.profilePicture" class="ss-user-pic" :style="`background-image: url(${user.profilePicture})`" />
            <div v-else class="ss-user-pic">
              {{ user | getInitials }}
            </div>
          </nuxt-link>

          <div class="navbar-dropdown is-right">
            <nuxt-link to="/account" class="navbar-item">
              My Account
            </nuxt-link>
            <nuxt-link to="/lists" class="navbar-item">
              My Lists
            </nuxt-link>
            <a class="navbar-item" @click.prevent="logout">
              Logout
            </a>
          </div>
        </div>
        <nuxt-link v-if="!userAuthenticated" to="/signup" class="navbar-item">
          Signup
        </nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { filter } from 'lodash'
import { mapState } from 'vuex'
import getSlug from '~/plugins/get-slug'

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
      remember: false,
      selectedResult: [],
      results: [],
      isLoading: false,
      slug: getSlug
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
    customLabel ({ title, desc }) {
      return `${title} – ${desc}`
    },
    onSelect (value) {
      this.results.splice(0, this.results.length)

      const type = value.media_type === 'movie' ? 'movies' : value.media_type
      const path = `/${type}/${this.slug(value.title)}-${value.id}`

      this.toogleMenuClass()
      this.$router.push({
        path
      })
    },
    onSearch (query) {
      this.isLoading = true
      this.$store.dispatch('search/search', query)
        .then((response) => {
          this.isLoading = false

          if (!response) {
            return
          }

          // Get only movies and tv
          const results = filter(response.results, (result) => {
            result.title = result.title || result.name
            return result.media_type === 'movie' || result.media_type === 'tv'
          })
          this.results = results
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    clearAll () {
      this.selectedResult = []
    },
    burgerMenuHandler() {
      this.$refs.navburger.addEventListener('click', () => {
        this.toogleMenuClass()
      })

      const $navbarItems = Array.prototype.slice.call(document.querySelectorAll('.navbar-item'), 0)
      const $navbarLinks = Array.prototype.slice.call(document.querySelectorAll('.navbar-link'), 0)

      if ($navbarItems.length > 0) {
        $navbarItems.forEach((el) => {
          if (el.classList.contains('search-bar') ||
          el.classList.contains('login-btn') ||
          el.classList.contains('has-dropdown')) {
            return
          }

          el.addEventListener('click', () => {
            this.toogleMenuClass()
          })
        })
      }

      if ($navbarLinks.length > 0) {
        $navbarLinks.forEach((el) => {
          el.addEventListener('click', () => {
            this.toogleMenuClass()
          })
        })
      }
    },
    toogleMenuClass() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      if (this.$refs.navburger) {
        this.$refs.navburger.classList.toggle('is-active')
      }

      if (this.$refs.mainmenu) {
        this.$refs.mainmenu.classList.toggle('is-active')
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
          return this.$store.dispatch('auth/verifyUser', true, this.remember)
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
