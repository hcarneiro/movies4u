<template>
  <div>
    <section class="ss-top-hero">
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div v-for="(movie, index) in bannerMovies" :key="index" class="swiper-slide" :style="`background-image: url(${getBackground(movie.backdrop_path)})`">
            <div class="ss-hero-screen" />
            <div class="hero-body">
              <h1 class="title">
                {{ movie | movieTitle }}
              </h1>
              <h2 class="subtitle">
                <nuxt-link
                  v-for="(tag, idx) in getTags(movie.genre_ids)"
                  :key="idx"
                  to="/"
                >
                  <b-tag rounded>
                    {{ tag }}
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
                <nuxt-link :to="`/movies/${movie.id}`" class="more-info">
                  More info
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets" />
      </div>
    </section>
    <div class="container ss-container">
      <p class="subtitle">
        Movies
      </p>
      <h2 class="title">
        NOW PLAYING
      </h2>
      <div class="columns is-multiline">
        <div v-for="(movie, index) in movies" :key="index" class="column is-4">
          <card
            :id="movie.id"
            :title="movie.title"
            :release-date="movie.release_date"
            :tags="getTags(movie.genre_ids)"
            :rating="movie.vote_average"
            :thumb="movie.poster_path | getBackdrop"
            base-url="/movies/"
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
      title: 'Now playing movies'
    }
  },
  components: {
    Card
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    ...mapState({
      movies: (state) => {
        return state.movies.nowPlayingList
      },
      bannerMovies: (state) => {
        return state.movies.nowPlayingList.slice(0, 4)
      },
      page: (state) => {
        return state.movies.nowPlayingPage
      },
      genres: (state) => {
        return state.genres
      }
    })
  },
  created() {
    this.getMovies()
  },
  methods: {
    getMovies() {
      return this.$store.dispatch('movies/getNowPlaying')
    },
    infiniteHandler($state) {
      this.$store.dispatch('movies/updateNowPlaying', this.page + 1)
        .then((response) => {
          if (response.results.length) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
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
    },
    getBackground(path) {
      if (!path) {
        return ''
      }

      return `https://image.tmdb.org/t/p/original${path}`
    }
  }
}
</script>
