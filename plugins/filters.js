import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', (value) => {
  return moment(value).format('MMM DD, YYYY')
})

Vue.filter('movieTitle', (movie) => {
  return movie.title || movie.name || movie.original_name || movie.original_title
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

Vue.filter('timeConvert', (n) => {
  const num = n
  const hours = (num / 60)
  const rhours = Math.floor(hours)
  const minutes = (hours - rhours) * 60
  const rminutes = Math.round(minutes)
  return `${rhours}h ${rminutes}m`
})

Vue.filter('moneyConvert', (n) => {
  if (!n) {
    return '-'
  }

  return `$${n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
})
