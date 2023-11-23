import React, { useState } from "react";
import classes from "./MovieImg.module.css"
import playButton from "./../../../images/play.png"

function MovieImg(props){

    function playButtonHandler(){
        props.displayTrailer(true);
    }
    

    return(
        <React.Fragment>
            <div className={classes["poster-container"]}>
                <img className={classes["movie-poster"]} src={props.source} alt="Movie Poster"/>
                <img className={classes["play-button"]} src={playButton} alt="play" onClick={playButtonHandler}/>
            </div>
        </React.Fragment>
    );
}

export default MovieImg;