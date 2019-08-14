<template>
  <div>
    <section class="ss-top-hero is-smaller" :style="`background-image: url(${getBackground(show.backdrop_path)})`">
      <div class="ss-hero-screen" />
    </section>
    <div v-if="isReady" class="container ss-detail-container">
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
              :to="`/genres/${tag.name.toLowerCase()}-${tag.id}/tv`"
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
      <div class="ss-detail-cast-holder columns is-variable is-8">
        <div class="column is-three-quarters">
          <h4 class="title is-4">
            Top Billed Cast
          </h4>
          <div class="columns is-multiline is-variable is-2-tablet is-4-desktop ss-cast-card-holder">
            <div v-for="(item, index) in cast" :key="index" class="column is-half-mobile is-one-fifth-tablet">
              <cast-card
                :id="item.id"
                :name="item.name"
                :character="item.character"
                :profile-image="getBackground(item.profile_path)"
              />
            </div>
          </div>
          <template v-if="show.videos && show.videos.results && show.videos.results.length">
            <h4 class="title is-4">
              Media
            </h4>
            <div class="ss-media-holder">
              <silentbox-group>
                <template v-for="(video, index) in show.videos.results">
                  <silentbox-item :key="index" :src="'https://www.youtube.com/watch?v=' + video.key" :description="video.name" />
                </template>
              </silentbox-group>
            </div>
          </template>
          <template v-if="recommendations && recommendations.length">
            <h4 class="title is-4">
              Recommendations
            </h4>
            <div class="columns is-variable is-2-tablet is-4-desktop ss-recommendations-holder">
              <div v-for="(recommendation, index) in recommendations" :key="index" class="column is-two-fifths-mobile is-one-fifth-tablet">
                <nuxt-link :to="`${slug(title(recommendation))}-${recommendation.id}`">
                  <div class="ss-recommendation-card">
                    <figure class="image is-16by9">
                      <img :src="getBackground(recommendation.backdrop_path)" :alt="recommendation | movieTitle">
                    </figure>
                    <div class="ss-recommendation-card-footer">
                      <div>
                        {{ recommendation | movieTitle }}
                      </div>
                      <div>
                        <no-ssr>
                          <vue-circle
                            :progress="calculatePercentage(recommendation.vote_average)"
                            :size="30"
                            line-cap="round"
                            :fill="getFillColor(calculatePercentage(recommendation.vote_average))"
                            :empty-fill="getEmptyFillColor(calculatePercentage(recommendation.vote_average))"
                            :thickness="3"
                            :start-angle="4.7"
                            :animation="false"
                            insert-mode="append"
                            :show-percent="true"
                            class="is-small"
                          />
                        </no-ssr>
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </template>
        </div>
        <div class="column is-one-quarter ss-facts-holder">
          <h4 class="title is-4">
            Facts
          </h4>
          <h6 class="title is-6">
            Status
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ show.status }}
          </p>
          <h6 class="title is-6">
            First aired
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ show | movieDate | formatDate }}
          </p>
          <template v-is="show.networks && show.networks.length">
            <h6 class="title is-6">
              Netwrok
            </h6>
            <p class="subtitle is-size-6 is-spaced">
              {{ getNetwork(show) }}
            </p>
          </template>
          <h6 class="title is-6">
            Original language
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ getLanguage(show.original_language) }}
          </p>
          <h6 class="title is-6">
            Type
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ show.type }}
          </p>
          <a
            v-if="show.homepage"
            class="button is-rounded"
            :href="show.homepage"
            target="_blank"
          >
            Visit website
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { map, find } from 'lodash'
import { mapState } from 'vuex'
import getSlug from '~/plugins/get-slug'
import getTitle from '~/plugins/get-title'
import CastCard from '~/components/CastCard'

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
  components: {
    CastCard
  },
  data() {
    return {
      id: undefined,
      percentage: 0,
      fillColor: {
        color: '#00d1b2'
      },
      emptyFillColor: 'rgba(0, 209, 178, 0.3)',
      isReady: false,
      slug: getSlug,
      title: getTitle
    }
  },
  computed: {
    ...mapState({
      show: (state) => {
        return state.tv.tvShow
      },
      cast: (state) => {
        if (state.tv.cast && state.tv.cast.length) {
          return state.tv.cast.slice(0, 5)
        }
      },
      recommendations: (state) => {
        return state.tv.showRecommendations
      },
      languages: (state) => {
        return state.languages
      }
    })
  },
  watch: {
    show(value) {
      if (value) {
        this.isReady = true
      }

      this.getRatingSettings()
    }
  },
  created() {
    this.id = this.$route.params.id.split('-').pop()
    this.$store.dispatch('tv/clearData', this.id)
    this.$store.dispatch('tv/getShow', this.id)
    this.$store.dispatch('tv/getCrew', this.id)
    this.$store.dispatch('tv/getRecommendations', this.id)
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
    calculatePercentage(average) {
      const percentage = ((average || this.show.vote_average) / 10) * 100

      if (!average) {
        this.percentage = percentage
      }

      return percentage
    },
    getFillColor(percentage) {
      const variable = !!percentage
      percentage = percentage || this.percentage
      const fillColor = {
        color: ''
      }

      if (percentage >= 0 && percentage <= 40) {
        fillColor.color = '#ff3860'
      }

      if (percentage >= 41 && percentage <= 60) {
        fillColor.color = '#ffdd57'
      }

      if (percentage >= 61 && percentage <= 100) {
        fillColor.color = '#00d1b2'
      }

      if (variable) {
        return fillColor
      }

      this.fillColor.color = fillColor.color
    },
    getEmptyFillColor(percentage) {
      const variable = !!percentage
      percentage = percentage || this.percentage
      let emptyFillColor

      if (percentage >= 0 && percentage <= 40) {
        emptyFillColor = 'rgba(255, 56, 96, 0.3)'
      }

      if (percentage >= 41 && percentage <= 60) {
        emptyFillColor = 'rgba(255, 221, 87, 0.3)'
      }

      if (percentage >= 61 && percentage <= 100) {
        emptyFillColor = 'rgba(0, 209, 178, 0.3)'
      }

      if (variable) {
        return emptyFillColor
      }

      this.emptyFillColor = emptyFillColor
    },
    getLanguage(iso) {
      const language = find(this.languages, (lang) => {
        return lang.iso_639_1 === iso
      })

      if (!language) {
        return
      }

      return language.english_name
    },
    getNetwork(show) {
      if (!show || !show.networks || !show.networks.length) {
        return '-'
      }

      return show.networks[0].name
    }
  }
}
</script>
