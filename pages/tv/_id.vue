<template>
  <div />
</template>

<script>
import { find, forEach } from 'lodash'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: this.tvShow.title,
      meta: [
        { hid: 'description', name: 'description', content: this.tvShow.title },
        { hid: 'og-image', property: 'og:image', content: this.getTags(this.tvShow.poster_path) },
        { hid: 'keywords', name: 'keywords', keywords: this.getThumb(this.tvShow.genre_ids) }
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
      tvShow: (state) => {
        return state.tv.tvShow
      }
    })
  },
  created() {
    this.id = this.$route.params.id
    this.$store.dispatch('movies/getShow', this.id)
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
