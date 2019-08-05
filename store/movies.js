import _ from 'lodash'

export const state = () => ({
  list: [],
  trendingList: [],
  popularList: [],
  topRatedList: [],
  nowPlayingList: [],
  movie: {},
  totalPages: 0,
  page: 1,
  totalResults: 0,
  totalTrendingPages: 0,
  trendingPage: 1,
  totalTrendingResults: 0,
  totalPopularPages: 0,
  popularPage: 1,
  totalPopularResults: 0,
  totalTopRatedPages: 0,
  topRatedPage: 1,
  totalTopRatedResults: 0,
  totalNowPlayingPages: 0,
  nowPlayingPage: 1,
  totalNowPlayingResults: 0,
  crew: undefined,
  cast: undefined
})

export const mutations = {
  unsetData(state) {
    state.crew = undefined
    state.cast = undefined
    state.movie = {}
  },
  setCrew(state, crew) {
    state.crew = crew
  },
  setCast(state, cast) {
    state.cast = cast
  },
  setMovies(state, movies) {
    state.list = movies
  },
  setTrendingMovies(state, movies) {
    state.trendingList = movies
  },
  setPopularMovies(state, movies) {
    state.popularList = movies
  },
  setTopRatedMovies(state, movies) {
    state.topRatedList = movies
  },
  setNowPlayingMovies(state, movies) {
    state.nowPlayingList = movies
  },
  updateMovies(state, movies) {
    _.forEach(movies, (movie) => {
      state.list.push(movie)
    })
  },
  updateTrending(state, movies) {
    _.forEach(movies, (movie) => {
      state.trendingList.push(movie)
    })
  },
  updatePopular(state, movies) {
    _.forEach(movies, (movie) => {
      state.popularList.push(movie)
    })
  },
  updateTopRated(state, movies) {
    _.forEach(movies, (movie) => {
      state.topRatedList.push(movie)
    })
  },
  updateNowPlaying(state, movies) {
    _.forEach(movies, (movie) => {
      state.nowPlayingList.push(movie)
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
  setTrendingTotalPages(state, total) {
    state.totalTrendingPages = total
  },
  setTrendingTotalResults(state, total) {
    state.totalTrendingResults = total
  },
  setTrendingPage(state, pageNumber) {
    state.trendingPage = pageNumber
  },
  setPopularTotalPages(state, total) {
    state.totalPopularPages = total
  },
  setPopularTotalResults(state, total) {
    state.totalPopularResults = total
  },
  setPopularPage(state, pageNumber) {
    state.popularPage = pageNumber
  },
  setTopRatedTotalPages(state, total) {
    state.totalTopRatedPages = total
  },
  setTopRatedTotalResults(state, total) {
    state.totalTopRatedResults = total
  },
  setTopRatedPage(state, pageNumber) {
    state.topRatedPage = pageNumber
  },
  setNowPlayingTotalPages(state, total) {
    state.totalNowPlayingPages = total
  },
  setNowPlayingTotalResults(state, total) {
    state.totalNowPlayingResults = total
  },
  setNowPlayingPage(state, pageNumber) {
    state.nowPlayingPage = pageNumber
  }
}

export const actions = {
  clearData({ commit, state }, id) {
    if (state.movie && state.movie.id) {
      const savedId = state.movie.id.toString()

      if (savedId !== id) {
        commit('unsetData')
      }
    }
  },
  getCrew({ commit, rootState }, id) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${rootState.env.TMDB_API_KEY}`)
      .then((response) => {
        if (response.status === 200) {
          commit('setCast', response.data.cast)
          commit('setCrew', response.data.crew)
          return Promise.resolve(response.data)
        }
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getTrending({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setTrendingMovies', response.data.results)
          commit('setTrendingTotalPages', response.data.total_pages)
          commit('setTrendingTotalResults', response.data.total_results)
          commit('setTrendingPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getPopular({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setPopularMovies', response.data.results)
          commit('setPopularTotalPages', response.data.total_pages)
          commit('setPopularTotalResults', response.data.total_results)
          commit('setPopularPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getTopRated({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setTopRatedMovies', response.data.results)
          commit('setTopRatedTotalPages', response.data.total_pages)
          commit('setTopRatedTotalResults', response.data.total_results)
          commit('setTopRatedPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getNowPlaying({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setNowPlayingMovies', response.data.results)
          commit('setNowPlayingTotalPages', response.data.total_pages)
          commit('setNowPlayingTotalResults', response.data.total_results)
          commit('setNowPlayingPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getMovies({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setMovies', response.data.results)
          commit('setTotalPages', response.data.total_pages)
          commit('setTotalResults', response.data.total_results)
          commit('setPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getMovie({ commit, rootState }, movieId) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setMovie', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getMovieGenres({ rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${rootState.env.TMDB_API_KEY}`)
  },
  updateMovies({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.page

    return this.$axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateMovies', response.data.results)
          commit('setTotalPages', response.data.total_pages)
          commit('setTotalResults', response.data.total_results)
          commit('setPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateTrending({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.trendingPage

    return this.$axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateTrending', response.data.results)
          commit('setTrendingTotalPages', response.data.total_pages)
          commit('setTrendingTotalResults', response.data.total_results)
          commit('setTrendingPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updatePopular({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.popularPage

    return this.$axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updatePopular', response.data.results)
          commit('setPopularTotalPages', response.data.total_pages)
          commit('setPopularTotalResults', response.data.total_results)
          commit('setPopularPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateTopRated({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.topRatedPage

    return this.$axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateTopRated', response.data.results)
          commit('setTopRatedTotalPages', response.data.total_pages)
          commit('setTopRatedTotalResults', response.data.total_results)
          commit('setTopRatedPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateNowPlaying({ commit, rootState }, page) {
    const currentPage = page || rootState.movies.nowPlayingPage

    return this.$axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateNowPlaying', response.data.results)
          commit('setNowPlayingTotalPages', response.data.total_pages)
          commit('setNowPlayingTotalResults', response.data.total_results)
          commit('setNowPlayingPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getVideos({ rootState }, movieId) {
    return this.$axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${rootState.env.TMDB_API_KEY}&language=en-US`)
      .then((response) => {
        if (response.status === 200) {
          if (!response.data.results.length) {
            return Promise.resolve('')
          }

          const videos = response.data.results
          const video = _.find(videos, { type: 'Trailer' })
          const videoURL = `https://www.youtube.com/embed/${video.key}?rel=0&modestbranding=1`
          return Promise.resolve(videoURL)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
