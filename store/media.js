export const state = () => ({})

export const mutations = {}

export const actions = {
  uploadThumb({ commit }, file) {
    return this.$axios.post(`/api/v1/upload/thumb`, file)
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }
      })
  }
}
