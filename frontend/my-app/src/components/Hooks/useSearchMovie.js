import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const API_KEY = '9cec5129d32cd0fc174b0a5bdea0e726';

const useMovieSearch = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_BASE_URL, {
          params: {
            api_key: API_KEY,
            language: 'en-US',
            query,
            page: 1,
            include_adult: false,
          },
        });

        const fetchedMovies = response.data.results.map((movie) => ({
          title: movie.title,
          poster_path: movie.poster_path,
          id:movie.id,
          release_date:movie.release_date,
          overview: movie.overview,
        }));

        setMovies(fetchedMovies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [query]);

  return { movies, isLoading };

};

export default useMovieSearch;
