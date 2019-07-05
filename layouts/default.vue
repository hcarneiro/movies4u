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

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="ss-main-menu">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="ss-main-menu" class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link to="/movies" class="navbar-item">
            Movies
          </nuxt-link>
          <nuxt-link to="/tv-shows" class="navbar-item">
            TV Shows
          </nuxt-link>
          <nuxt-link to="/news" class="navbar-item">
            News
          </nuxt-link>
        </div>
        <div class="navbar-end">
          <b-dropdown position="is-bottom-left" aria-role="menu">
            <a
              slot="trigger"
              class="navbar-item"
              role="button"
            >
              <span>Login</span>
              <b-icon icon="menu-down" />
            </a>

            <b-dropdown-item aria-role="menu-item" custom paddingless>
              <form action="">
                <div class="modal-card" style="width:300px;">
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
export default {
  data() {
    return {
      isScrolled: false
    }
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
    }
  }
}
</script>
