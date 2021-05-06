export const selectMovie = (movie) => {
    console.log("selct move called ");
    console.log(movie)
    return {
        types: 'MOVIE_SELECTED',
        payload: movie
    }
}
