export const state = () => ({})

export const mutations = {}

export const actions = {
  userUpdate({ commit }, data) {
    return this.$axios.put('/api/v1/users', data)
      .then((response) => {
        if (response.status === 200) {
          commit('auth/setUser', response.data.user, { root: true })
          return response.data
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  },
  deleteProfile({ dispatch }, data) {
    return this.$axios.delete(`/api/v1/users/${data.id}`)
      .then(() => {
        return dispatch('auth/logout')
      })
  }
}
