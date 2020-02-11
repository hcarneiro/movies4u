export const state = () => ({})

export const mutations = {}

export const actions = {
  search({ rootState }, query) {
    if (!query) {
      return
    }

    return this.$axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${rootState.env.TMDB_API_KEY}&language=en-US&include_adult=false&query=${query}`)
      .then((response) => {
        if (response.status === 200) {
          return Promise.resolve(response.data)
        }

        return Promise.reject(response)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}
