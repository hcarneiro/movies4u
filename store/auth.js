import Cookies from 'js-cookie'
import moment from 'moment'

const COOKIE_EXPIRE_DAYS = 30
const COOKIE = {
  userToken: '_auth_token'
}

export const state = () => ({
  currentUser: {},
  verified: false,
  authenticated: false,
  auth_token: ''
})

export const mutations = {
  setUser(state, user) {
    state.currentUser = user
  },
  setVerified(state, status) {
    state.verified = status
  },
  setAuthenticated(state, status) {
    state.authenticated = status
  },
  setAuthToken(state, token) {
    state.auth_token = token
  }
}

export const actions = {
  login({ dispatch }, credentials) {
    credentials = credentials || {}

    return this.$axios.post('/api/v1/auth/login', credentials)
      .then((response) => {
        dispatch('onLogin', response.data.auth_token, credentials)
        return response.data
      })
  },
  logout({ commit }) {
    return this.$axios.post('/api/v1/auth/logout')
      .then(() => {
        commit('setUser', {})
        Cookies.remove(COOKIE.userToken)
        commit('setAuthenticated', false)
        commit('setAuthToken', '')
        commit('setVerified', false)

        return Promise.resolve()
      })
  },
  onLogin({ commit }, authToken, options) {
    if (!authToken) {
      throw new Error('Cannot login with no authToken')
    }

    commit('setVerified', true)
    commit('setAuthenticated', true)
    commit('setAuthToken', authToken)

    const remember = options ? options.remember : Cookies.get('_remember')

    if (Cookies.get('_remember') || remember) {
      Cookies.set('_remember', remember ? 'true' : '', {
        expires: remember ? COOKIE_EXPIRE_DAYS : undefined
      })
    }

    Cookies.set('_auth_token', authToken, {
      expires: Cookies.get('_remember') ? COOKIE_EXPIRE_DAYS : undefined
    })
  },
  verifyUser({ state, commit, dispatch }, forceCheck, setCookie) {
    return dispatch('isLoggedIn')
      .then((isLoggedIn) => {
        if (!isLoggedIn && !forceCheck) {
          return Promise.reject(new Error('You are not signed in. Please sign in.'))
        }

        const params = { _: moment().unix() }

        if (setCookie) {
          params.setCookie = true
          params.auth_token = state.auth_token
        }

        return this.$axios.get('/api/v1/users', { params })
      })
      .then((response) => {
        return response
      })
      .then((response) => {
        const user = response.data.user
        commit('setUser', user)
        dispatch('onLogin', user.auth_token)
        return Promise.resolve()
      })
      .catch((err) => {
        if (forceCheck) {
          dispatch('logout')
        }
        return Promise.reject(err)
      })
  },
  isLoggedIn({ state, commit }) {
    if (!state.authenticated) {
      commit('setAuthToken', Cookies.get(COOKIE.userToken))
      commit('setAuthenticated', !!state.auth_token)
    }

    return state.authenticated
  },
  verify({ state, dispatch }) {
    if (state.verified && state.currentUser && state.currentUser.hasOwnProperty('auth_token')) {
      return Promise.resolve()
    }

    return dispatch('verifyUser', true)
  },
  verifyUserEmail({ dispatch }, token) {
    return this.$axios.post(`/api/v1/auth/verify/${token}`)
      .then((response) => {
        // Token is stored to log the user in
        dispatch('onLogin', response.data.auth_token)
        return Promise.resolve()
      })
  },
  // eslint-disable-next-line no-empty-pattern
  forgotPassword({}, email) {
    return this.$axios.post('/api/v1/auth/forgot', { email })
  },
  // eslint-disable-next-line no-empty-pattern
  resetPassword({}, params) {
    const password = params.password || ''
    const token = params.token || ''

    return this.$axios.post(`/api/v1/auth/reset/${token}`, { password })
  },
  // eslint-disable-next-line no-empty-pattern
  getResetTokenInfo({}, token) {
    return this.$axios.get(`/api/v1/auth/reset/${token}`)
  },
  // eslint-disable-next-line no-empty-pattern
  signUp({}, data) {
    return this.$axios.post('/api/v1/auth/signup', data).then((response) => {
      return Promise.resolve(response.data)
    })
  }
}
