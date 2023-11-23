import React from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';
import classes from "./MovieCard.module.css";

const MovieCard = ({ movie }) => {
  const navigate= useNavigate();

  
  function clickHandler(){
    navigate("/detail/"+movie.id);
  }

  return (
    <div className={classes["movie-card"]}>
      {movie.poster_path && (
        <img
          className={classes["movie-poster"]}
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
          alt={movie.title}
          style={{ marginRight: '1rem' }}
          onClick={clickHandler}
        />
      )}
      <div className={classes["movie-details"]}>
        <Rating rating={movie.vote_average.toFixed(1)} />
        <h3>{movie.title}</h3>
        <p>{movie.release_date}</p>
      </div>
    </div>
  );
};

export default MovieCard;
