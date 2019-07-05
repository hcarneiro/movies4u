<template>
  <div>
    <section class="hero is-light is-large ss-top-hero" style="background-image: url(/the-martian-wallpaper.jpg)">
      <div class="ss-hero-screen" />
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            The Martian
          </h1>
          <h2 class="subtitle">
            <nuxt-link to="/">
              <b-tag rounded>
                Adventure
              </b-tag>
            </nuxt-link>
            <nuxt-link to="/">
              <b-tag rounded>
                Science Fiction
              </b-tag>
            </nuxt-link>
            <nuxt-link to="/">
              <b-tag rounded>
                Thriller
              </b-tag>
            </nuxt-link>
          </h2>

          <div class="hero-tools">
            <b-button rounded>
              <span>
                Watch trailer
              </span>
              <b-icon icon="play-circle-outline" size="is-small" />
            </b-button>
          </div>
        </div>
      </div>
    </section>
    <div class="container ss-container">
      <h2 class="title">
        In Theaters
      </h2>
      <div class="columns">
        <div class="column is-one-third">
          <card
            title="Avengers: Endgame"
            :tags="['Action', 'Adventure', 'Science Fiction']"
            rating="8.4"
            thumb="https://image.tmdb.org/t/p/w370_and_h556_bestv2/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
          />
        </div>
        <div class="column is-one-third">
          <card
            title="Spider-Man: Far from Home"
            :tags="['Action', 'Adventure', 'Science Fiction']"
            rating="7.8"
            thumb="https://image.tmdb.org/t/p/w370_and_h556_bestv2/2cAc4qH9Uh2NtSujJ90fIAMrw7T.jpg"
          />
        </div>
        <div class="column is-one-third">
          <card
            title="Captain Marvel"
            :tags="['Action', 'Adventure', 'Science Fiction']"
            rating="7.0"
            thumb="https://image.tmdb.org/t/p/w370_and_h556_bestv2/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'HomePage',
  components: {
    Card
  }
}
</script>
