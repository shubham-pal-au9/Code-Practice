import React from 'react';
import { connect } from 'react-redux';

const MovieDetails = (props) => {
    if(!props.selectMovie) {
        return(
            <div className="details-container" style={{width:'70%'}}> 
                <h2> Movie </h2>
                <div className="properties">
                    <p> Select Movie </p>
                </div>
            </div>
        )
    }
    else {
        return(
            <div className="details-container" style={{width:'70%'}}> 
                <h2> Movie </h2>
                <div className="properties">
                    <p>Title:{props.selectMovie.title}</p>
                    <p>Release Date:{props.selectMovie.releaseDate}</p>
                    <p>Rating:{props.selectMovie.rating}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectMovie: state.selectMovie
}
}

export default connect(mapStateToProps)(MovieDetails)