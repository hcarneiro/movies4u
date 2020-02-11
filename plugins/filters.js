import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', (value) => {
  return moment(value).format('MMM DD, YYYY')
})

Vue.filter('yearOnly', (value) => {
  return moment(value).format('YYYY')
})

Vue.filter('fromNow', (value) => {
  return moment(value).fromNow()
})

Vue.filter('calendar', (value) => {
  return moment(value).calendar(null, {
    sameDay: '[Today at] hh:mm',
    nextDay: '[Tomorrow at] hh:mm',
    nextWeek: '[Next] dddd',
    lastDay: '[Yesterday at] hh:mm',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
  })
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

Vue.filter('getInitials', (user) => {
  if (!user || !user.hasOwnProperty('auth_token')) {
    return ''
  }

  const firstNameInitial = user.firstName.charAt(0).toUpperCase()
  const lastNameInitial = user.lastName.charAt(0).toUpperCase()

  return `${firstNameInitial}${lastNameInitial}`
})
