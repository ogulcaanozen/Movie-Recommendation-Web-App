import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchPosters(movieIDs) {
  const [moviePosters, setMoviePosters] = useState([]);
  const [movieKeys, setMovieKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const IMG_URL = 'https://image.tmdb.org/t/p/w500';
  const apiKey = '9cec5129d32cd0fc174b0a5bdea0e726';
  const language = 'en-US';

  useEffect(() => {
    const fetchPostersAndKeys = async () => {
      const promises = movieIDs.map(async (movie) => {
        try {
          const posterResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie}/images?api_key=${apiKey}`);

          const keyResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie}/videos?api_key=${apiKey}&language=${language}`);

          if (posterResponse.status === 200 && keyResponse.status === 200) {
            const fetchedPoster = IMG_URL + posterResponse.data.backdrops[0].file_path;
            const fetchedKey = keyResponse.data.results.length > 0 ? keyResponse.data.results[0].key : null;
            return { poster: fetchedPoster, key: fetchedKey };
          } else {
            return { poster: null, key: null };
          }
        } catch (error) {
          console.error('Error fetching posters and keys:', error);
          return { poster: null, key: null };
        }
      });

      const fetchedData = await Promise.all(promises);
      setMoviePosters(fetchedData.map((item) => item.poster).filter((poster) => poster !== null));
      setMovieKeys(fetchedData.map((item) => item.key).filter((key) => key !== null));
      setIsLoading(false);
    };

    fetchPostersAndKeys();
  }, [movieIDs]);

  return { moviePosters, movieKeys, isLoading };
}

export default useFetchPosters;
