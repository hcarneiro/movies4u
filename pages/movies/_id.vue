<template>
  <div>
    <section class="ss-top-hero is-smaller" :style="`background-image: url(${getBackground(movie.backdrop_path)})`">
      <div class="ss-hero-screen" />
    </section>
    <div v-if="isReady" class="container ss-detail-container">
      <div class="ss-detail-heading-holder">
        <div v-if="movie.poster_path" class="ss-poster-holder">
          <p class="image is-2by3 ss-movie-poster">
            <img v-if="movie.poster_path" :src="movie.poster_path | getBackdrop" alt="title">
            <img v-else src="~assets/no-poster.png" alt="No poster available">
          </p>
          <div v-if="percentage" class="is-hidden-tablet ss-circle-holder">
            <client-only>
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
            </client-only>
          </div>
        </div>
        <div class="column is-offset-one-third ss-detail-heading">
          <div class="columns ss-title-wrapper">
            <div class="column">
              <h1 class="title">
                {{ movie | movieTitle }}
              </h1>
            </div>
            <div v-if="userAuthenticated" class="column is-flex is-hidden-mobile ss-add-list-desktop">
              <div v-if="movieAddedToList" class="ss-added-lists">
                <b-dropdown v-if="listMovieIsIn.length" hoverable aria-role="list">
                  <button slot="trigger" class="button">
                    <span>Movie added to:</span>
                    <b-icon icon="menu-down" />
                  </button>

                  <b-dropdown-item
                    v-for="option in listMovieIsIn"
                    :key="option.id"
                    aria-role="listitem"
                    :custom="true"
                  >
                    <div class="ss-list-dropdown-item">
                      <span>
                        {{ option.title }} <small v-if="!option.public">(Private)</small>
                      </span>
                      <a href="#" @click.prevent="onDeleteItem(option.id)">
                        <b-icon icon="delete" size="is-small" />
                      </a>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div v-if="allUserLists.length" class="control">
                <div class="select">
                  <select v-model="listSelected" @change="onSelectList">
                    <option disabled="disabled" hidden="hidden" value="none">
                      Add to list
                    </option>
                    <option
                      v-for="option in allUserLists"
                      :key="option.id"
                      :value="option.id"
                      :disabled="option.disabled"
                    >
                      {{ option.title }} <small v-if="!option.public">(Private)</small>
                    </option>
                  </select>
                </div>
              </div>
              <b-button v-else @click="onCreateList()">
                Create list <b-icon icon="plus" size="is-small" type="is-primary" />
              </b-button>
            </div>
          </div>
          <p class="subtitle">
            <nuxt-link
              v-for="(tag, idx) in movie.genres"
              :key="idx"
              :to="`/genres/${slug(title(tag))}-${tag.id}/movies`"
            >
              <b-tag rounded>
                {{ tag.name }}
              </b-tag>
            </nuxt-link>
          </p>
          <div v-if="userAuthenticated" class="ss-add-list is-flex is-hidden-tablet">
            <div v-if="movieAddedToList" class="ss-added-lists">
              <b-dropdown v-if="listMovieIsIn.length" hoverable aria-role="list">
                <button slot="trigger" class="button">
                  <span>Movie added to:</span>
                  <b-icon icon="menu-down" />
                </button>

                <b-dropdown-item
                  v-for="option in listMovieIsIn"
                  :key="option.id"
                  aria-role="listitem"
                  :custom="true"
                >
                  <div class="ss-list-dropdown-item">
                    <span>
                      {{ option.title }} <small v-if="!option.public">(Private)</small>
                    </span>
                    <a href="#" @click.prevent="onDeleteItem(option.id)">
                      <b-icon icon="delete" size="is-small" />
                    </a>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div v-if="allUserLists.length" class="control">
              <div class="select">
                <select v-model="listSelected" @change="onSelectList">
                  <option disabled="disabled" hidden="hidden" value="none">
                    Add to list
                  </option>
                  <option
                    v-for="option in allUserLists"
                    :key="option.id"
                    :value="option.id"
                    :disabled="option.disabled"
                  >
                    {{ option.title }} <small v-if="!option.public">(Private)</small>
                  </option>
                </select>
              </div>
            </div>
            <b-button v-else @click="onCreateList()">
              Create list <b-icon icon="plus" size="is-small" type="is-primary" />
            </b-button>
          </div>
          <p>
            {{ movie.overview }}
          </p>
          <div class="columns is-multiline ss-detail-heading-tools">
            <div v-if="percentage" class="column is-full-mobile is-full-tablet is-one-fifth-desktop is-hidden-mobile ss-tool-holder">
              <div class="ss-circle-holder">
                <client-only>
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
                </client-only>
              </div>
            </div>
            <div v-for="(item, index) in crew" :key="index" class="column is-half-mobile is-one-fifth-desktop ss-tool-holder">
              <p class="header">
                {{ item.name }}
              </p>
              <p>
                {{ item.job }}
              </p>
            </div>
            <div v-if="movie.runtime" class="column is-half-mobile is-one-fifth-desktop ss-tool-holder">
              <p class="header">
                {{ movie.runtime | timeConvert }}
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
          <template v-if="movie.videos && movie.videos.results && movie.videos.results.length">
            <h4 class="title is-4">
              Media
            </h4>
            <div class="ss-media-holder">
              <silentbox-group>
                <template v-for="(video, index) in movie.videos.results">
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
              <div v-for="(recommendation, index) in recommendations" :key="index" class="column is-three-fifths-mobile is-one-fifth-tablet">
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
                        <client-only>
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
                        </client-only>
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
            {{ movie.status }}
          </p>
          <h6 class="title is-6">
            Release date
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ movie | formatDate }}
          </p>
          <h6 class="title is-6">
            Original language
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ getLanguage(movie.original_language) }}
          </p>
          <h6 class="title is-6">
            Budget
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ movie.budget | moneyConvert }}
          </p>
          <h6 class="title is-6">
            Revenue
          </h6>
          <p class="subtitle is-size-6 is-spaced">
            {{ movie.revenue | moneyConvert }}
          </p>
          <a
            v-if="movie.homepage"
            class="button is-rounded"
            :href="movie.homepage"
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
import { map, filter, uniqBy, find, cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import slug from '~/plugins/get-slug'
import title from '~/plugins/get-title'
import CastCard from '~/components/CastCard'
import bus from '~/plugins/bus'

export default {
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
      listSelected: 'none',
      filteredLists: [],
      movieAddedToList: false,
      listMovieIsIn: [],
      allUserLists: []
    }
  },
  computed: {
    ...mapState({
      movie: (state) => {
        return state.movies.movie
      },
      cast: (state) => {
        if (state.movies.cast && state.movies.cast.length) {
          return state.movies.cast.slice(0, 5)
        }
      },
      crew: (state) => {
        const crew = filter(state.movies.crew, (item) => {
          return item.job === 'Director' || item.job === 'Writer' || item.job === 'Screenplay'
        })

        return uniqBy(crew, 'job')
      },
      recommendations: (state) => {
        return state.movies.movieRecommendations
      },
      languages: (state) => {
        return state.languages
      },
      myLists: (state) => {
        return state.lists.allUserLists
      },
      userAuthenticated: (state) => {
        return state.auth.authenticated
      },
      user: (state) => {
        return state.auth.currentUser
      }
    })
  },
  watch: {
    movie(value) {
      if (value) {
        this.isReady = true
      }

      this.getRatingSettings()
    },
    myLists(value) {
      if (value && value.length) {
        this.cloneLists()
      }
    }
  },
  created() {
    this.id = this.$route.params.id.split('-').pop()
    this.$store.dispatch('movies/clearData', this.id)
    this.$store.dispatch('movies/getMovie', this.id)
    this.$store.dispatch('movies/getCrew', this.id)
    this.$store.dispatch('movies/getRecommendations', this.id)
    this.$store.dispatch('lists/getUserLists')
  },
  methods: {
    title,
    slug,
    cloneLists() {
      this.allUserLists = cloneDeep(this.myLists)
      this.filterLists()
    },
    filterLists(reset) {
      const listIndexes = []

      if (reset) {
        this.movieAddedToList = false
        this.listMovieIsIn = []
      }

      this.allUserLists.forEach((list, index) => {
        const foundMovie = find(list.movies, { id: parseInt(this.id, 10) })

        if (!foundMovie) {
          return
        }

        this.movieAddedToList = true
        this.listMovieIsIn.push(list)
        listIndexes.push(index)
      })

      if (!listIndexes.length) {
        return
      }

      listIndexes.forEach((index) => {
        this.allUserLists.splice(index, 1)
      })
    },
    onSelectList() {
      const listId = this.listSelected
      this.listSelected = 'none'

      this.$store.dispatch('lists/addMovieToList', {
        id: listId,
        item: this.movie,
        categories: this.movie.genres,
        type: 'movies'
      })
        .then(() => {
          this.filterLists()
        })
    },
    onCreateList() {
      bus.$emit('open-list-modal', {
        type: 'create',
        context: 'private',
        userId: this.user.id,
        movie: this.movie
      })
    },
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
      const percentage = ((average || this.movie.vote_average) / 10) * 100

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
    onDeleteItem(listId) {
      this.$buefy.dialog.confirm({
        title: 'Delete',
        message: `Are you sure you want to delete <strong>${this.$options.filters.movieTitle(this.movie)}</strong> from the list?`,
        confirmText: 'Delete',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteFromList(listId)
        }
      })
    },
    deleteFromList(listId) {
      this.$store.dispatch('lists/removeFromList', {
        listId,
        itemId: this.id
      })
        .then((lists) => {
          this.allUserLists = lists
          this.filterLists(true)
        })
    }
  },
  head() {
    return {
      title: this.$options.filters.movieTitle(this.movie),
      meta: [
        { hid: 'description', name: 'description', content: this.movie.overview },
        { hid: 'og-image', property: 'og:image', content: this.getBackground(this.movie.backdrop_path) },
        { hid: 'keywords', name: 'keywords', keywords: this.compileTags(this.movie.genres) }
      ]
    }
  }
}
</script>
