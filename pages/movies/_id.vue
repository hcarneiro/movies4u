<template>
  <div />
</template>

<script>
import { find, forEach } from 'lodash'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: this.movie.title,
      meta: [
        { hid: 'description', name: 'description', content: this.movie.title },
        { hid: 'og-image', property: 'og:image', content: this.getTags(this.movie.poster_path) },
        { hid: 'keywords', name: 'keywords', keywords: this.getThumb(this.movie.genre_ids) }
      ]
    }
  },
  data() {
    return {
      id: undefined
    }
  },
  computed: {
    ...mapState({
      movie: (state) => {
        return state.movies.movie
      }
    })
  },
  created() {
    this.id = this.$route.params.id
    this.$store.dispatch('movies/getMovie', this.id)
  },
  methods: {
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
