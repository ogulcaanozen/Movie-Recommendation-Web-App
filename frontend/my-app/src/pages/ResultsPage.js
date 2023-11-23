import React from "react";
import Header from "../components/Header/Header";
import ResultMovieCard from "../components/Body/ResultMovieCard";
import { useParams } from "react-router-dom";
import useMovieSearch from "../components/Hooks/useSearchMovie";
import styles from "./ResultsPage.module.css";

function ResultsPage(){
    const { query } = useParams();
    const { movies = [], isLoading } = useMovieSearch(query); // provide a default value

    const POSTER_URL = "https://image.tmdb.org/t/p/w500/";

    return (
        <React.Fragment>
          <Header />
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className={[styles["mainContainer"]]} >
                <h2>Searched For "{query}"</h2>
              {movies.map((movie) => (
                <ResultMovieCard
                  key={movie.id}
                  poster={POSTER_URL + movie.poster_path}
                  id={movie.id}
                  title={movie.title}
                  date={movie.release_date}
                  overview={movie.overview}
                />
              ))}
            </div>
          )}
        </React.Fragment>
      );
      
}

export default ResultsPage;
