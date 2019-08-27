import _ from 'lodash'

export const state = () => ({
  allPublic: [],
  public: [],
  private: [],
  currentList: undefined
})

export const mutations = {
  setAllPublicLists(state, lists) {
    state.allPublic = lists
  },
  setPublicLists(state, lists) {
    state.public = lists
  },
  setPrivateLists(state, lists) {
    state.private = lists
  },
  setCurrentList(state, list) {
    state.currentList = list
  },
  addNewPublicList(state, item) {
    state.public.push(item)
  },
  addNewPrivateList(state, item) {
    state.private.push(item)
  }
}

export const actions = {
  getLists({ commit }, data) {
    return this.$axios.get('/api/v1/lists', data)
      .then((response) => {
        if (response.status === 200) {
          commit('setAllPublicLists', response.data.result)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getUserLists({ commit }, data) {
    return this.$axios.get('/api/v1/lists/user', data)
      .then((response) => {
        if (response.status === 200) {
          const publicLists = _.filter(response.data.result, { public: true })
          const privateLists = _.filter(response.data.result, { public: false })

          commit('setPublicLists', publicLists)
          commit('setPrivateLists', privateLists)
          return response.data
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  addNewList({ commit }, data) {
    return this.$axios.post('/api/v1/lists/user', data)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.result.public) {
            commit('addNewPublicList', response.data.result)
          } else {
            commit('addNewPrivateList', response.data.result)
          }

          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateList({ commit }, data) {
    return this.$axios.put('/api/v1/lists/user', data)
      .then((response) => {
        if (response.status === 200) {
          commit('setCurrentList', response.data.result)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
