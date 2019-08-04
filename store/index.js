let privateConfig
try {
  privateConfig = require('../config/private-config.json')
} catch (err) {
  privateConfig = undefined
}

export const state = () => ({
  env: {
    NODE_ENV: 'development'
  },
  genres: undefined,
  languages: undefined
})

export const mutations = {
  setEnv(state, env) {
    state.env = env
  },
  setGenres(state, genres) {
    state.genres = genres
  },
  setLanguages(state, languages) {
    state.languages = languages
  }
}

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    // read runtime environment everytimes and set to store
    const env = {}
    env.NODE_ENV = process.env.NODE_ENV || 'development'
    env.TMDB_API_KEY = process.env.TMDB_API_KEY || privateConfig.TMDB_API_KEY
    commit('setEnv', env)

    if (req.session && req.user) {
      await dispatch('auth/onLogin', req.user.auth_token)
    }

    const response = await dispatch('movies/getMovieGenres')
    commit('setGenres', response.data.genres)
    const langResponse = await dispatch('getLanguages')
    commit('setLanguages', langResponse.data)
  },
  getLanguages({ state }) {
    return this.$axios.get(`https://api.themoviedb.org/3/configuration/languages?api_key=${state.env.TMDB_API_KEY}`)
  }
}
