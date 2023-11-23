import React, { useEffect, useContext } from 'react';
import Header from '../components/Header/Header';
import { MyContext } from '../context/Context';
import TrendingMovies from '../components/Body/Trending Movies/TrendingMovies';
import VideoList from '../components/Body/Movie Videos/VideoList';
import classes from "./Homepage.module.css";
import { verifyToken } from '../services/authService';

function Homepage() {
  const { isLoggedIn, setIsLoggedIn, setShows } = useContext(MyContext);

  const getMovieID = (movieID) => {
    setShows(movieID);
  };

  const checkLoginStatus = async () => {
    try {
      const { isValid } = await verifyToken();
      console.log("isvalid:"+isValid);
      setIsLoggedIn(isValid);
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className={classes["body-container"]}>
        <VideoList />
        <TrendingMovies getID={getMovieID} title={"Trendings"} explanation={"Watch the latest popular shows"} endpoint={"https://api.themoviedb.org/3/trending/all/day?api_key=9cec5129d32cd0fc174b0a5bdea0e726"} />
        <TrendingMovies title={"Popular Movies"} explanation={"Watch the popular movies"} endpoint={"https://api.themoviedb.org/3/movie/popular?api_key=9cec5129d32cd0fc174b0a5bdea0e726&language=en-US&page=1"} />
      </div>
    </React.Fragment>
  );
}

export default Homepage;
