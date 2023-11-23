import React, {useState} from "react";
import classes from "./MovieTrailer.module.css";
import YouTube from 'react-youtube';


function MovieTrailer(props){


    function playButtonHandler(){
        props.displayTrailer(false);
    }

    const videoOptions = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 1,
        },
    };

    console.log("trailer keys:"+props.trailerKeys);


    return (
        <React.Fragment>
            <div className={classes["video-popup"]}>
                <div className={classes["video-popup-overlay"]} onClick={playButtonHandler} />
                <div className={classes["video-popup-content"]}>
                    <YouTube videoId={props.trailerKeys} opts={videoOptions} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default MovieTrailer;