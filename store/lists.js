import _ from 'lodash'

export const state = () => ({
  allPublic: [],
  allUserLists: [],
  public: [],
  private: [],
  currentList: undefined
})

export const mutations = {
  setAllPublicLists(state, lists) {
    state.allPublic = lists
  },
  setAllUserLists(state, lists) {
    state.allUserLists = lists
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
    state.public.unshift(item)
  },
  addNewPrivateList(state, item) {
    state.private.unshift(item)
  },
  addNewList(state, item) {
    state.allUserLists.unshift(item)
  },
  unsetData(state) {
    state.currentList = undefined
  },
  updateAllLists(state, list) {
    state.allUserLists.some((li, index) => {
      if (li.id === list.id) {
        state.allUserLists.splice(index, 1, list)
        return true
      }
    })

    state.public.some((li, index) => {
      if (li.id === list.id) {
        state.public.splice(index, 1, list)
        return true
      }
    })

    state.private.some((li, index) => {
      if (li.id === list.id) {
        state.private.splice(index, 1, list)
        return true
      }
    })
  },
  removeFromLists(state, id) {
    state.allUserLists.some((list, index) => {
      if (list.id === id) {
        state.allUserLists.splice(index, 1)
        return true
      }
    })

    state.public.some((list, index) => {
      if (list.id === id) {
        state.public.splice(index, 1)
        return true
      }
    })

    state.private.some((list, index) => {
      if (list.id === id) {
        state.private.splice(index, 1)
        return true
      }
    })
  }
}

export const actions = {
  getLists({ commit }, data) {
    return this.$axios.get('/api/v1/lists/all', data)
      .then((response) => {
        if (response.status === 200) {
          commit('setAllPublicLists', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getUserLists({ commit }) {
    return this.$axios.get('/api/v1/lists')
      .then((response) => {
        if (response.status === 200) {
          commit('setAllUserLists', response.data)

          const publicLists = _.filter(response.data, { public: true })
          const privateLists = _.filter(response.data, { public: false })

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
    return this.$axios.post('/api/v1/lists', data)
      .then((response) => {
        if (response.status === 200) {
          commit('addNewList', response.data)

          if (response.data.public) {
            commit('addNewPublicList', response.data)
          } else {
            commit('addNewPrivateList', response.data)
          }

          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  updateList({ commit }, options) {
    options = options || {}
    const id = options.listId
    const data = options.data

    return this.$axios.put(`/api/v1/lists/${id}`, data)
      .then((response) => {
        if (response.status === 200) {
          commit('updateAllLists', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  addMovieToList({ commit }, options) {
    options = options || {}
    const id = options.id
    const item = options.item
    const categories = options.categories
    const type = options.type

    return this.$axios.put(`/api/v1/lists/${id}/add-movie`, {
      item,
      categories,
      type
    })
      .then((response) => {
        if (response.status === 200) {
          commit('updateAllLists', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  getList({ commit }, id) {
    return this.$axios.get(`/api/v1/lists/${id}`)
      .then((response) => {
        if (response.status === 200) {
          commit('setCurrentList', response.data)
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  deleteList({ commit, state }, id) {
    return this.$axios.delete(`/api/v1/lists/${id}`)
      .then((response) => {
        if (response.status === 200) {
          commit('removeFromLists', id)

          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  clearData({ commit, state }, id) {
    if (state.currentList && state.currentList.id) {
      const savedId = state.currentList.id.toString()

      if (savedId !== id) {
        commit('unsetData')
      }
    }
  }
}
