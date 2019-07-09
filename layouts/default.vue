<template>
  <div>
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
          @click="toggleBurgerMenu"
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
          <b-dropdown position="is-bottom-left" aria-role="menu">
            <a
              slot="trigger"
              class="navbar-item"
              role="button"
            >
              <span>Login</span>
              <b-icon icon="menu-down is-hidden-touch" />
            </a>

            <b-dropdown-item aria-role="menu-item" custom paddingless>
              <form>
                <div class="modal-card login-form">
                  <section class="modal-card-body">
                    <b-field label="Email">
                      <b-input
                        type="email"
                        placeholder="Your email"
                        required
                      />
                    </b-field>

                    <b-field label="Password">
                      <b-input
                        type="password"
                        password-reveal
                        placeholder="Your password"
                        required
                      />
                    </b-field>

                    <b-checkbox>Remember me</b-checkbox>
                  </section>
                  <footer class="modal-card-foot">
                    <button class="button is-primary">
                      Login
                    </button>
                  </footer>
                </div>
              </form>
            </b-dropdown-item>
          </b-dropdown>
          <nuxt-link to="/signup" class="navbar-item">
            Signup
          </nuxt-link>
        </div>
      </div>
    </nav>

    <section class="main-content ss-content">
      <nuxt />
    </section>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {
      isScrolled: false,
      burgerIsActive: false,
      menuLinks: '.navbar-item, navbar-link'
    }
  },
  mounted() {
    this.attachHandlers()
  },
  methods: {
    toggleBurgerMenu(value) {
      if (typeof value === 'undefined' || typeof value !== 'boolean') {
        value = !this.burgerIsActive
      }
      this.burgerIsActive = value
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
      $(document).on('click', this.menuLinks, () => {
        this.toggleBurgerMenu(false)
      })

      window.addEventListener('scroll', this.onScroll)
    }
  }
}
</script>
