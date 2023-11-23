import React from "react";
import style from "./ResultMovieCard.module.css"
import { useNavigate } from "react-router-dom";

function ResultMovieCard(props){
    const navigator = useNavigate();

    function clickHandler(){
        navigator("detail/"+props.id);
    }
    return (
        <React.Fragment>
            <div className={style.resultCardContainer} onClick={clickHandler}>
                <div className={style.posterContainer}>
                    <img src={props.poster} alt={props.title} />
                </div>
                <div className={style.infoContainer}>
                    <h3>{props.title}</h3>
                    <p>{props.date}</p>
                    <p>{props.overview}</p>
                </div>
            </div>
        </React.Fragment>

    )
}

export default ResultMovieCard;