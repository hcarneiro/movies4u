import { find, forEach } from 'lodash'

export default (ids, genres) => {
  function getTags(ids) {
    const genresList = []

    forEach(ids, (id) => {
      const genre = find(genres, (genre) => {
        return genre.id === id
      })

      if (genre) {
        genresList.push(genre)
      }
    })

    return genresList
  }

  return getTags(ids)
}
