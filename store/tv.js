import _ from 'lodash'

export const state = () => ({
  popularList: [],
  topRatedList: [],
  onTvList: [],
  airingTodayList: [],
  tvShow: {},
  totalPopularPages: 0,
  popularPage: 1,
  totalPopularResults: 0,
  totalTopRatedPages: 0,
  topRatedPage: 1,
  totalTopRatedResults: 0,
  totalOnTvPages: 0,
  onTvpage: 1,
  totalOnTvResults: 0,
  totalAiringTodayPages: 0,
  airingTodayPage: 1,
  totalAiringTodayResults: 0
})

export const mutations = {
  setPopularShows(state, shows) {
    state.popularList = shows
  },
  setTopRatedShows(state, shows) {
    state.topRatedList = shows
  },
  setOnTvShows(state, shows) {
    state.onTvList = shows
  },
  setAiringTodayShows(state, shows) {
    state.airingTodayList = shows
  },
  updatePopular(state, shows) {
    _.forEach(shows, (show) => {
      state.popularList.push(show)
    })
  },
  updateTopRated(state, shows) {
    _.forEach(shows, (show) => {
      state.topRatedList.push(show)
    })
  },
  updateOnTv(state, shows) {
    _.forEach(shows, (show) => {
      state.onTvList.push(show)
    })
  },
  updateAiringToday(state, shows) {
    _.forEach(shows, (show) => {
      state.airingTodayList.push(show)
    })
  },
  setShow(state, show) {
    state.tvShow = show
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
  setOnTvTotalPages(state, total) {
    state.totalOnTvPages = total
  },
  setOnTvTotalResults(state, total) {
    state.totalOnTvResults = total
  },
  setOnTvPage(state, pageNumber) {
    state.onTvPage = pageNumber
  },
  setAiringTodayTotalPages(state, total) {
    state.totalAiringTodayPages = total
  },
  setAiringTodayTotalResults(state, total) {
    state.totalAiringTodayResults = total
  },
  setAiringTodayPage(state, pageNumber) {
    state.airingTodayPage = pageNumber
  }
}

export const actions = {
  getPopular({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setPopularShows', response.data.results)
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
    return this.$axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setTopRatedShows', response.data.results)
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
  getOnTv({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setOnTvShows', response.data.results)
          commit('setOnTvTotalPages', response.data.total_pages)
          commit('setOnTvTotalResults', response.data.total_results)
          commit('setOnTvPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getAiringToday({ commit, rootState }) {
    return this.$axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=1&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setAiringTodayShows', response.data.results)
          commit('setAiringTodayTotalPages', response.data.total_pages)
          commit('setAiringTodayTotalResults', response.data.total_results)
          commit('setAiringTodayPage', response.data.page)
          return Promise.resolve(response.data.results)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getShow({ commit, rootState }, tvId) {
    return this.$axios.get(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('setShow', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updatePopular({ commit, rootState }, page) {
    const currentPage = page || rootState.tv.popularPage

    return this.$axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
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
    const currentPage = page || rootState.tv.topRatedPage

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
  updateOnTv({ commit, rootState }, page) {
    const currentPage = page || rootState.tv.onTvPage

    return this.$axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateOnTv', response.data.results)
          commit('setOnTvTotalPages', response.data.total_pages)
          commit('setOnTvTotalResults', response.data.total_results)
          commit('setOnTvPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateAiringToday({ commit, rootState }, page) {
    const currentPage = page || rootState.tv.airingTodayPage

    return this.$axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&page=${currentPage}&append_to_response=videos`)
      .then((response) => {
        if (response.status === 200) {
          commit('updateAiringToday', response.data.results)
          commit('setAiringTodayTotalPages', response.data.total_pages)
          commit('setAiringTodayTotalResults', response.data.total_results)
          commit('setAiringTodayPage', response.data.page)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getVideos({ rootState }, tvId) {
    return this.$axios.get(`https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${rootState.env.TMDB_API_KEY}&language=en-US`)
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
