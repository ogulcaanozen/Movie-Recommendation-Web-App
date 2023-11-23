import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoupeImage from "./../../../images/loupe.png";
import classes from "./SearchForm.module.css";
import SearchCard from "./SearchCard";
import useMovieSearch from "../../Hooks/useSearchMovie";

function SearchForm() {
  const [query, setQuery] = useState('');
  const navigator = useNavigate();
  const { movies, isLoading } = useMovieSearch(query); // destructure movies and isLoading

  function clickHandler(){
    navigator("/results/"+query);
  }

  return (
    <React.Fragment>
      <div className={classes["form-container"]}>
        <form action="/search" method="get">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <button type="submit" onClick={clickHandler}>
            <img src={LoupeImage} alt="Search"></img>
          </button>
        </form>
        <div>
          {movies && !isLoading &&
            movies.slice(0, 3).map((movie, index) => (
              <SearchCard key={movie.id} movie={movie} isFirst={index === 0} />
            ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default SearchForm;
