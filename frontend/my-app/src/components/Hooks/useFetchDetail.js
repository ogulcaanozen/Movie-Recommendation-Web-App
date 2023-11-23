import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchMovieData = (movieId) => {
  const [movieData, setMovieData] = useState(null);
  const apiKey = '9cec5129d32cd0fc174b0a5bdea0e726';

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieDetailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        );

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`
        );

        const {
          genres,
          original_title: originalTitle,
          poster_path: posterPath,
          release_date: releaseDate,
          vote_average: voteAverage,
          overview: overview,
        } = movieDetailsResponse.data;

        const names = castResponse.data.cast.map((castMember) => castMember.name);

        setMovieData({
          genres,
          originalTitle,
          posterPath,
          releaseDate,
          voteAverage,
          overview,
          names,
        });
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  return movieData;
};

export default useFetchMovieData;
