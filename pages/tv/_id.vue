<template>
  <div>
    <section class="ss-top-hero is-smaller" :style="`background-image: url(${getBackground(show.backdrop_path)})`">
      <div class="ss-hero-screen" />
    </section>
    <div class="container ss-detail-container">
      <div class="ss-detail-heading-holder">
        <div v-if="show.poster_path" class="ss-poster-holder">
          <p class="image is-2by3 ss-movie-poster">
            <img v-if="show.poster_path" :src="show.poster_path | getBackdrop" alt="title">
            <img v-else src="~assets/no-poster.png" alt="No poster available">
          </p>
          <div v-if="percentage" class="is-hidden-tablet ss-circle-holder">
            <no-ssr>
              <vue-circle
                :progress="percentage"
                :size="100"
                line-cap="round"
                :fill="fillColor"
                :empty-fill="emptyFillColor"
                :thickness="8"
                :start-angle="4.7"
                :animation="false"
                insert-mode="append"
                :show-percent="true"
                class="is-light"
              />
            </no-ssr>
          </div>
        </div>
        <div class="column is-offset-one-third ss-detail-heading">
          <h1 class="title">
            {{ show | movieTitle }}
          </h1>
          <p class="subtitle">
            <nuxt-link
              v-for="(tag, idx) in show.genres"
              :key="idx"
              :to="`/genres/${tag.id}/tv`"
            >
              <b-tag rounded>
                {{ tag.name }}
              </b-tag>
            </nuxt-link>
          </p>
          <p>
            {{ show.overview }}
          </p>
          <div class="columns is-multiline ss-detail-heading-tools">
            <div v-if="percentage" class="column is-full-mobile is-full-tablet is-one-fifth-desktop is-hidden-mobile ss-tool-holder">
              <div class="ss-circle-holder">
                <no-ssr>
                  <vue-circle
                    :progress="percentage"
                    :size="60"
                    line-cap="round"
                    :fill="fillColor"
                    :empty-fill="emptyFillColor"
                    :thickness="5"
                    :start-angle="4.7"
                    :animation="false"
                    insert-mode="append"
                    :show-percent="true"
                  />
                </no-ssr>
              </div>
            </div>
            <div v-for="(item, index) in show.created_by" :key="index" class="column is-half-mobile is-one-fifth-desktop ss-tool-holder">
              <p class="header">
                {{ item.name }}
              </p>
              <p>
                Creator
              </p>
            </div>
            <div v-if="show.runtime" class="column is-half-mobile is-one-fifth-desktop ss-tool-holder">
              <p class="header">
                {{ show.runtime | timeConvert }}
              </p>
              <p>
                Runtime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { map } from 'lodash'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: this.$options.filters.movieTitle(this.show),
      meta: [
        { hid: 'description', name: 'description', content: this.show.overview },
        { hid: 'og-image', property: 'og:image', content: this.getBackground(this.show.backdrop_path) },
        { hid: 'keywords', name: 'keywords', keywords: this.compileTags(this.show.genres) }
      ]
    }
  },
  data() {
    return {
      id: undefined,
      percentage: 0,
      fillColor: {
        color: '#00d1b2'
      },
      emptyFillColor: 'rgba(0, 209, 178, 0.3)'
    }
  },
  computed: {
    ...mapState({
      show: (state) => {
        return state.tv.tvShow
      },
      cast: (state) => {
        return state.tv.cast
      }
    })
  },
  watch: {
    show() {
      this.getRatingSettings()
    }
  },
  created() {
    this.id = this.$route.params.id.split('-').pop()
    this.$store.dispatch('tv/clearData', this.id)
    this.$store.dispatch('tv/getShow', this.id)
    this.$store.dispatch('tv/getCrew', this.id)
  },
  methods: {
    getBackground(path) {
      if (!path) {
        return ''
      }

      return `https://image.tmdb.org/t/p/original${path}`
    },
    compileTags(genres) {
      const names = map(genres, 'name')
      const joined = names.join(', ')
      return joined
    },
    getRatingSettings() {
      this.calculatePercentage()
      this.getFillColor()
      this.getEmptyFillColor()
    },
    calculatePercentage() {
      this.percentage = (this.show.vote_average / 10) * 100
    },
    getFillColor() {
      if (this.percentage >= 0 && this.percentage <= 40) {
        this.fillColor.color = '#ff3860'
        return
      }

      if (this.percentage >= 41 && this.percentage <= 60) {
        this.fillColor.color = '#ffdd57'
        return
      }

      if (this.percentage >= 61 && this.percentage <= 100) {
        this.fillColor.color = '#00d1b2'
        return
      }

      this.fillColor.color = '#00d1b2'
    },
    getEmptyFillColor() {
      if (this.percentage >= 0 && this.percentage <= 40) {
        this.emptyFillColor = 'rgba(255, 56, 96, 0.3)'
        return
      }

      if (this.percentage >= 41 && this.percentage <= 60) {
        this.emptyFillColor = 'rgba(255, 221, 87, 0.3)'
        return
      }

      if (this.percentage >= 61 && this.percentage <= 100) {
        this.emptyFillColor = 'rgba(0, 209, 178, 0.3)'
        return
      }

      this.emptyFillColor = 'rgba(0, 209, 178, 0.3)'
    }
  }
}
</script>
