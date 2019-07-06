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
        UPCOMING MOVIES
      </h2>
      <div class="columns is-multiline">
        <div v-for="(movie, index) in movies" :key="index" class="column is-4">
          <card
            :title="movie.title"
            :tags="getTags(movie.genre_ids)"
            :rating="movie.vote_average"
            :thumb="getThumb(movie.poster_path)"
          />
        </div>
      </div>
      <no-ssr>
        <infinite-loading v-if="movies && movies.length" @infinite="infiniteHandler" />
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { find, forEach } from 'lodash'
import { mapState } from 'vuex'
import Card from '~/components/Card'

export default {
  head() {
    return {
      title: 'Movies 4 U',
      titleTemplate: null
    }
  },
  components: {
    Card
  },
  computed: {
    ...mapState({
      movies: (state) => {
        return state.movies.list
      },
      page: (state) => {
        return state.movies.page
      },
      totalPages: (state) => {
        return state.movies.totalPages
      },
      totalResults: (state) => {
        return state.movies.totalResults
      },
      genres: (state) => {
        return state.movies.genres
      }
    })
  },
  created() {
    this.getMovies()
  },
  methods: {
    getMovies() {
      return this.$store.dispatch('movies/getMovies')
    },
    infiniteHandler($state) {
      this.$store.dispatch('movies/updateMovies', this.page + 1)
        .then((response) => {
          if (response.results.length) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
    },
    getThumb(path) {
      if (!path) {
        return
      }

      return `https://image.tmdb.org/t/p/w500${path}`
    },
    getTags(ids) {
      const genres = []

      forEach(ids, (id) => {
        const genre = find(this.genres, (genre) => {
          return genre.id === id
        })

        if (genre) {
          genres.push(genre.name)
        }
      })

      return genres
    }
  }
}
</script>
