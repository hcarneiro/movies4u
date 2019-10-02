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
  setPublicLists(state) {
    state.public = _.filter(state.allUserLists, { public: true })
  },
  setPrivateLists(state) {
    state.private = _.filter(state.allUserLists, { public: false })
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
  },
  removeFromCurrentList(state, id) {
    let removeIndex
    state.currentList.movies.forEach((item, index) => {
      if (item.id !== parseInt(id, 10)) {
        return
      }

      removeIndex = index
    })

    state.currentList.movies.splice(removeIndex, 1)
  },
  removeFromList(state, options) {
    const list = _.find(state.allUserLists, { id: options.listId })
    let removeIndex

    if (!list) {
      return
    }

    list.movies.forEach((item, index) => {
      if (item.id !== parseInt(options.itemId, 10)) {
        return
      }

      removeIndex = index
    })

    list.movies.splice(removeIndex, 1)

    // Update public and private lists
    state.public = _.filter(state.allUserLists, { public: true })
    state.private = _.filter(state.allUserLists, { public: false })
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
          commit('setPublicLists')
          commit('setPrivateLists')
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
  deleteList({ commit }, id) {
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
  },
  removeFromCurrentList({ commit, dispatch, state }, id) {
    commit('removeFromCurrentList', id)
    dispatch('updateList', {
      listId: state.currentList.id,
      data: state.currentList
    })
  },
  removeFromList({ commit, dispatch, state }, options) {
    const list = _.find(state.allUserLists, { id: options.listId })

    if (!list) {
      return
    }

    commit('removeFromList', options)
    dispatch('updateList', {
      listId: options.listId,
      data: list
    })
    return state.allUserLists
  }
}
