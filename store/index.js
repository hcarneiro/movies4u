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
  genres: undefined
})

export const mutations = {
  setEnv(state, env) {
    state.env = env
  },
  setGenres(state, genres) {
    state.genres = genres
  }
}

export const actions = {
  nuxtServerInit({ commit, dispatch }) {
    // read runtime environment everytimes and set to store
    const env = {}
    env.NODE_ENV = process.env.NODE_ENV || 'development'
    env.TMDB_API_KEY = process.env.TMDB_API_KEY || privateConfig.TMDB_API_KEY
    commit('setEnv', env)

    dispatch('movies/getMovieGenres')
      .then((response) => {
        commit('setGenres', response.data.genres)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
