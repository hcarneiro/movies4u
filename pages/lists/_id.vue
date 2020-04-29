<template>
  <div v-if="list">
    <section class="ss-top-hero is-smaller" :style="`background-image: url(${list.thumbnail || noThumbPoster})`">
      <div class="ss-hero-screen" />
    </section>
    <div class="container ss-detail-container">
      <div class="ss-detail-heading-holder">
        <div class="ss-poster-holder">
          <div v-if="list.thumbnail" class="ss-movie-poster ss-list-image" :style="`background-image: url(${list.thumbnail})`" />
          <div v-else class="ss-list-image" :style="`background-image: url(${noThumbPoster})`" />
        </div>
        <div class="column is-offset-one-third ss-detail-heading">
          <h1 class="title">
            {{ list.title }}
          </h1>
          <p class="subtitle">
            <template v-for="(category, index) in list.categories">
              <b-tag :key="index" rounded>
                {{ category.name }}
              </b-tag>
            </template>
          </p>
          <p class="subtitle">
            {{ list.description }}
          </p>
          <p>
            Created by {{ listCreatorName(list) }}, {{ list.createdAt | fromNow }}
          </p>
          <div class="ss-detail-heading-tools">
            <b-button rounded @click="shareModal">
              Share <b-icon icon="share" size="is-small" />
            </b-button>
          </div>
        </div>
      </div>
      <div v-if="movies && movies.length" class="ss-list-movies-holder columns is-multiline">
        <div class="column is-12">
          <h4 class="title is-4">
            Movies
          </h4>
        </div>
        <div v-for="(movie, index) in movies" :key="index" class="column is-half-tablet is-one-quarter-desktop">
          <card
            :id="movie.id"
            :title="movie | movieTitle"
            :release-date="movie | movieDate"
            :tags="movie.genres"
            :rating="movie.vote_average"
            :thumb="movie.poster_path | getBackdrop"
            :base-url="`/${movie.type}`"
            :show-delete="true"
            @deleteCard="deleteCard"
          />
        </div>
      </div>
      <div v-if="tvshows && tvshows.length" class="ss-list-movies-holder columns is-multiline">
        <div class="column is-12">
          <h4 class="title is-4">
            TV Shows
          </h4>
        </div>
        <div v-for="(tv, index) in tvshows" :key="index" class="column is-half-tablet is-one-quarter-desktop">
          <card
            :id="tv.id"
            :title="tv | movieTitle"
            :release-date="tv | movieDate"
            :tags="tv.genres"
            :rating="tv.vote_average"
            :thumb="tv.poster_path | getBackdrop"
            :base-url="`/${tv.type}`"
            :show-delete="true"
            @deleteCard="deleteCard"
          />
        </div>
      </div>
      <div v-if="(!movies && !tvshows) || (!movies.length && !tvshows.length)" class="ss-list-movies-holder columns is-multiline">
        <div class="column is-12">
          <h4 class="title is-4">
            The list is still empty!
          </h4>
          <p class="subtitle">
            Add some movies or tv shows.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { find, filter, map } from 'lodash'
import { mapState } from 'vuex'
import noThumbPoster from '~/assets/no-poster.png'
import Card from '~/components/Card'
import bus from '~/plugins/bus'

export default {
  components: {
    Card
  },
  data() {
    return {
      noThumbPoster
    }
  },
  computed: {
    ...mapState({
      list: (state) => {
        return state.lists.currentList || {}
      },
      env: (state) => {
        return state.env || {}
      },
      genres: (state) => {
        return state.genres
      }
    }),
    movies() {
      return filter(this.list.movies, { type: 'movies' }) || []
    },
    tvshows() {
      return filter(this.list.movies, { type: 'tv' }) || []
    },
    keywords() {
      return map(this.list.categories, (category) => {
        return category.name
      }).join(', ')
    }
  },
  created() {
    const id = this.$route.params.id.split('-').pop()
    this.$store.dispatch('lists/clearData', id)
    this.$store.dispatch('lists/getList', id)
  },
  methods: {
    listCreatorName(list) {
      const creator = find(list.users, { id: list.creatorId })
      if (!creator) {
        return ''
      }
      return `${creator.firstName} ${creator.lastName}`
    },
    deleteCard(id) {
      this.$store.dispatch('lists/removeFromCurrentList', id)
    },
    shareModal() {
      bus.$emit('list-share-modal', {
        title: this.list.title,
        url: window.location.href
      })
    }
  },
  head() {
    return {
      title: this.list.title,
      meta: [
        { hid: 'description', name: 'description', content: this.list.description },
        { hid: 'og-image', property: 'og:image', content: this.list.thumbnail ? this.list.thumbnail : this.env.NODE_ENV !== 'development' ? `https://www.thatmovielist.com${noThumbPoster}` : `http://localhost:3000${noThumbPoster}` },
        { hid: 'keywords', name: 'keywords', keywords: this.keywords },
        { hid: 'robots', name: 'robots', content: this.list.public ? 'index, follow' : 'noindex, nofollow' },
        { hid: 'og-title', name: 'og:title', content: this.list.title }
      ]
    }
  }
}
</script>
