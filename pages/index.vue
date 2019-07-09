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
                <b-button rounded @click="openVideoModal(movie.id)">
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
      <b-modal :active.sync="isModalActive">
        <div class="video-container">
          <iframe
            width="560"
            height="315"
            :src="modalVideoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </b-modal>
    </section>
    <div class="container ss-container">
      <p class="subtitle">
        Movies - Today
      </p>
      <h2 class="title">
        TRENDING
      </h2>
      <div class="columns is-multiline">
        <div v-for="(movie, index) in movies" :key="index" class="column is-4">
          <card
            :id="movie.id"
            :title="movie | movieTitle"
            :release-date="movie | movieDate"
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
      title: 'Movie list to watch',
      titleTemplate: null
    }
  },
  components: {
    Card
  },
  data() {
    return {
      isModalActive: false,
      modalVideoUrl: undefined,
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
        return state.movies.trendingList
      },
      bannerMovies: (state) => {
        return state.movies.trendingList.slice(0, 4)
      },
      page: (state) => {
        return state.movies.trendingPage
      },
      totalPages: (state) => {
        return state.movies.totalTrendingPages
      },
      totalResults: (state) => {
        return state.movies.totalTrendingResults
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
      return this.$store.dispatch('movies/getTrending')
    },
    infiniteHandler($state) {
      this.$store.dispatch('movies/updateTrending', this.page + 1)
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
    },
    openVideoModal(id) {
      this.isModalActive = !this.isModalActive
      this.getMovieVideo(id)
    },
    async getMovieVideo(id) {
      this.modalVideoUrl = await this.$store.dispatch('movies/getVideos', id)
    }
  }
}
</script>
