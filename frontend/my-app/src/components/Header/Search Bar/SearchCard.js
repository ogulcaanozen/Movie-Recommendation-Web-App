import React from "react";
import classes from "./SearchCard.module.css";
import { useNavigate } from "react-router-dom";

function SearchCard(props){
    const { movie } = props;
    const navigate = useNavigate();
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    function clickHandler(){
        navigate("/detail/"+props.movie.id);
    }

    return(
        <div className={classes["card"]} onClick={clickHandler}>
            { (
                <img
                src={posterUrl}
                alt={props.movie.title}
                style={{ marginRight: '1rem' }}
                />
            )}
            <div>{props.movie.title}</div>
        </div>
    );
}

export default SearchCard;