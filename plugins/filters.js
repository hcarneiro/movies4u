import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', (value) => {
  return moment(value).format('MMM DD, YYYY')
})

Vue.filter('movieTitle', (movie) => {
  return movie.title || movie.original_name || movie.original_title
})

Vue.filter('movieDate', (movie) => {
  return movie.release_date || movie.first_air_date
})

Vue.filter('getBackdrop', (path) => {
  if (!path) {
    return ''
  }

  return `https://image.tmdb.org/t/p/w500${path}`
})

Vue.filter('getBackground', (path) => {
  if (!path) {
    return ''
  }

  return `https://image.tmdb.org/t/p/original${path}`
})
