<template>
  <div>
    <section class="ss-top-hero">
      <div v-if="isReady" v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div v-for="(tvShow, index) in bannerTvShows" :key="index" class="swiper-slide" :style="`background-image: url(${getBackground(tvShow.backdrop_path)})`">
            <div class="ss-hero-screen" />
            <div class="container hero-body">
              <h1 class="title">
                {{ tvShow | movieTitle }}
              </h1>
              <h2 class="subtitle">
                <nuxt-link
                  v-for="(tag, idx) in tags(tvShow.genre_ids, genres)"
                  :key="idx"
                  :to="`/genres/${slug(title(tag))}-${tag.id}/tv`"
                >
                  <b-tag rounded>
                    {{ tag.name }}
                  </b-tag>
                </nuxt-link>
              </h2>

              <div class="hero-tools" :class="{ 'is-one-button': !tvShow.hasTrailer }">
                <b-button v-if="tvShow.hasTrailer" rounded @click="openVideoModal(tvShow.id)">
                  <span>
                    Watch trailer
                  </span>
                  <b-icon icon="play-circle-outline" size="is-small" />
                </b-button>
                <nuxt-link :to="`/tv/${slug(title(tvShow))}-${tvShow.id}`" class="more-info">
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
        TV Shows
      </p>
      <h2 class="title">
        POPULAR
      </h2>
      <div class="columns is-multiline">
        <div v-for="(tvShow, index) in tvShows" :key="index" class="column is-4">
          <card
            :id="tvShow.id"
            :title="tvShow | movieTitle"
            :release-date="tvShow | movieDate"
            :tags="tags(tvShow.genre_ids, genres)"
            :rating="tvShow.vote_average"
            :thumb="tvShow.poster_path | getBackdrop"
            base-url="/tv"
          />
        </div>
      </div>
      <client-only>
        <infinite-loading v-if="tvShows && tvShows.length" @infinite="infiniteHandler" />
      </client-only>
    </div>
  </div>
</template>

<script>
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
      isReady: false,
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
      tvShows: (state) => {
        return state.tv.popularList
      },
      bannerTvShows: (state) => {
        return state.tv.popularList.slice(0, 5)
      },
      page: (state) => {
        return state.tv.popularPage
      },
      genres: (state) => {
        return state.genres
      }
    })
  },
  watch: {
    bannerTvShows() {
      this.checkIfHasVideo()
    }
  },
  created() {
    this.getTvShows()
  },
  methods: {
    title,
    tags,
    slug,
    getTvShows() {
      return this.$store.dispatch('tv/getPopular')
    },
    infiniteHandler($state) {
      this.$store.dispatch('tv/updatePopular', this.page + 1)
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
      this.getTvVideo(id)
    },
    getTvVideo(id) {
      if (!id) {
        return false
      }

      return this.$store.dispatch('tv/getVideos', id)
        .then((result) => {
          this.modalVideoUrl = result
          return Promise.resolve(result)
        })
    },
    checkIfHasVideo() {
      const promises = []
      this.bannerTvShows.forEach((show, index) => {
        promises.push(this.getTvVideo(show.id)
          .then((result) => {
            show.hasTrailer = result
            this.$set(this.bannerTvShows, index, show)
          }))
      })

      Promise.all(promises)
        .then(() => {
          this.isReady = true
        })
    }
  },
  head() {
    return {
      title: 'Popular TV Shows',
      meta: [
        { hid: 'description', name: 'description', content: 'Popular TV Shows' },
        { hid: 'keywords', name: 'keywords', keywords: 'Shows, TV Shows, Popular TV Shows, TV Lists, TV Shows Lists, TV Shows Inspiration, TV Shows Wishlist, Inspiration List' }
      ]
    }
  }
}
</script>
