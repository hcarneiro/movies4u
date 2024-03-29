<template>
  <div>
    <section class="ss-top-hero">
      <div v-if="isReady" v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div v-for="(movie, index) in bannerMovies" :key="index" class="swiper-slide" :style="`background-image: url(${getBackground(movie.backdrop_path)})`">
            <div class="ss-hero-screen" />
            <div class="container hero-body">
              <h1 class="title">
                {{ movie | movieTitle }}
              </h1>
              <h2 class="subtitle">
                <nuxt-link
                  v-for="(tag, idx) in tags(movie.genre_ids, genres)"
                  :key="idx"
                  :to="`/genres/${slug(title(tag))}-${tag.id}/movies`"
                >
                  <b-tag rounded>
                    {{ tag.name }}
                  </b-tag>
                </nuxt-link>
              </h2>

              <div class="hero-tools" :class="{ 'is-one-button': !movie.hasTrailer }">
                <b-button v-if="movie.hasTrailer" rounded @click="openVideoModal(movie.id)">
                  <span>
                    Watch trailer
                  </span>
                  <b-icon icon="play-circle-outline" size="is-small" />
                </b-button>
                <nuxt-link :to="`/movies/${slug(title(movie))}-${movie.id}`" class="more-info">
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
        Movies
      </p>
      <h2 class="title">
        {{ genreName }}
      </h2>
      <div class="columns is-multiline">
        <div v-for="(movie, index) in movies" :key="index" class="column is-4">
          <card
            :id="movie.id"
            :title="movie | movieTitle"
            :release-date="movie | movieDate"
            :tags="tags(movie.genre_ids, genres)"
            :rating="movie.vote_average"
            :thumb="movie.poster_path | getBackdrop"
            base-url="/movies"
          />
        </div>
      </div>
      <client-only>
        <infinite-loading v-if="movies && movies.length" @infinite="infiniteHandler" />
      </client-only>
    </div>
  </div>
</template>

<script>
import { find } from 'lodash'
import { mapState } from 'vuex'
import tags from '~/plugins/get-tags'
import slug from '~/plugins/get-slug'
import title from '~/plugins/get-title'
import Card from '~/components/Card'

export default {
  components: {
    Card
  },
  data() {
    return {
      id: parseInt(this.$route.params.id.split('-').pop(), 10),
      isReady: false,
      isModalActive: false,
      modalVideoUrl: undefined,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      genreName: undefined
    }
  },
  computed: {
    ...mapState({
      movies: (state) => {
        return state.movies.discoverList
      },
      bannerMovies: (state) => {
        return state.movies.discoverList.slice(0, 5)
      },
      page: (state) => {
        return state.movies.discoverPage
      },
      genres: (state) => {
        return state.genres
      }
    })
  },
  watch: {
    bannerMovies() {
      this.checkIfHasVideo()
    }
  },
  created() {
    this.getMovies()
    this.getGenreName()
  },
  methods: {
    tags,
    slug,
    title,
    getMovies() {
      return this.$store.dispatch('movies/movieDiscover', this.id)
    },
    infiniteHandler($state) {
      this.$store.dispatch('movies/updateDiscover', {
        page: this.page + 1,
        genreId: this.id
      })
        .then((response) => {
          if (response.results.length) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
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
    getMovieVideo(id) {
      if (!id) {
        return false
      }

      return this.$store.dispatch('movies/getVideos', id)
        .then((result) => {
          this.modalVideoUrl = result
          return Promise.resolve(result)
        })
    },
    checkIfHasVideo() {
      const promises = []
      this.bannerMovies.forEach((show, index) => {
        promises.push(this.getMovieVideo(show.id)
          .then((result) => {
            show.hasTrailer = result
            this.$set(this.bannerMovies, index, show)
          }))
      })

      Promise.all(promises)
        .then(() => {
          this.isReady = true
        })
    },
    getGenreName() {
      const genre = find(this.genres, { id: this.id })

      if (!genre) {
        return
      }

      this.genreName = genre.name.toUpperCase()
    }
  },
  head() {
    return {
      title: `${this.genreName} - Movies`,
      meta: [
        { hid: 'og-title', name: 'og:title', content: `${this.genreName} - Movies` }
      ]
    }
  }
}
</script>
