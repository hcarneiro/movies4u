import _ from 'lodash'

export const state = () => ({
  list: [],
  movie: {},
  totalPages: 0,
  page: 1,
  totalResults: 0,
  genres: []
})

export const mutations = {
  setMovies(state, movies) {
    state.list = movies
  },
  updateMovies(state, movies) {
    _.forEach(movies, (movie) => {
      state.list.push(movie)
    })
  },
  setMovie(state, movie) {
    state.movie = movie
  },
  setTotalPages(state, total) {
    state.setTotalPages = total
  },
  setTotalResults(state, total) {
    state.totalResults = total
  },
  setPage(state, pageNumber) {
    state.page = pageNumber
  },
  setGenreList(state, list) {
    state.genres = list
  }
}

export const actions = {
  getMovies({ commit, dispatch, rootState }) {
    const getMovieGenres = dispatch('getMovieGenres')
    const getMovies = this.$axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1`)

    return Promise.all([getMovieGenres, getMovies])
      .then((results) => {
        if (!results.length) {
          throw new Error('Something went wrong!')
        }

        const genreResults = results[0]
        const movieResults = results[1]

        if (genreResults.status === 200) {
          commit('setGenreList', genreResults.data.genres)
        }

        if (movieResults.status === 200) {
          commit('setMovies', movieResults.data.results)
          commit('setTotalPages', movieResults.data.total_pages)
          commit('setTotalResults', movieResults.data.total_results)
          commit('setPage', movieResults.data.page)
          return Promise.resolve(movieResults.data)
        }

        return Promise.reject(results)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getMovieGenres({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${rootState.env.TMDB_API_KEY}`)
  },
  updateMovies({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.page

    return this.$axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}`)
      .then((res) => {
        if (res.status === 200) {
          commit('updateMovies', res.data.results)
          commit('setTotalPages', res.data.total_pages)
          commit('setTotalResults', res.data.total_results)
          commit('setPage', res.data.page)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
