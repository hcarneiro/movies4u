export default (movie) => {
  return movie.title || movie.name || movie.original_name || movie.original_title
}
