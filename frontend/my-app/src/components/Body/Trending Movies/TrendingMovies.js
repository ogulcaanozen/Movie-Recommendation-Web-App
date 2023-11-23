// TrendingMovies.js
import React, {useCallback, useContext, useEffect} from 'react';
import MovieCard from '../MovieCard';
import classes from './MoviesList.module.css';
import useFetchMovies from '../../Hooks/useFetchMovies';
import { MyContext } from './../../../context/Context';


const TrendingMovies = (props) => {
  const [shows,isLoading] = useFetchMovies(props.endpoint);
  const myCtx = useContext(MyContext);

  useEffect(() => {
    if (!isLoading && props.getID) {
      const showIDs =shows.map((movie) => {
        return movie.id;
      })
      myCtx.setShows(shows.map((show) => {
        return show.id;
      }));
      myCtx.setShowVideoList(true);
    }
  }, [isLoading]);


  return (
    <React.Fragment>
      <div className={classes["title-container"]}>
        <h1>{props.title}</h1>
        <p>{props.explanation}</p>
      </div>
      <div style={{ display: 'flex', flexWrap:"wrap", justifyContent:"center",marginTop:"20px", gap: '1.5rem', backgroundColor:'black',height:"330px" }}>
      
        {shows.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </React.Fragment>
    
  );
};

export default TrendingMovies;
