import { combineReducers } from 'redux';

const moviesReducer = () => {
    return [
        {title:"Spider Man Home Coming",releaseDate:"05-07-2017",rating:7.4,},
        {title:"Black Panther",releaseDate:"02-12-2018",rating:7.4,},
        {title:"Aquaman",releaseDate:"12-07-2018",rating:7.4,},
        {title:"Avenger",releaseDate:"07-07-2014",rating:7.4,},
    ]
}

const selectedMovieReducer = (state = null,action) => {
    console.log("inside reducer")
    console.log(action.payload)

    switch(action.type) {
        case 'MOVIE_SELECTED':
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
    movies: moviesReducer,
    selectMovie: selectedMovieReducer
})