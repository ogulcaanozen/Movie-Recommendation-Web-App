import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchMovies = (endpoint) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(endpoint);

        if (response.status === 200) {
          const fetchedItems = response.data.results.slice(0, 8).map((item) => {
            const isMovie = item.media_type === 'movie' || endpoint.includes('/movie/');
            return {
              id: item.id,
              title: isMovie ? item.title : item.name,
              poster_path: item.poster_path,
              release_date: isMovie ? item.release_date : item.first_air_date,
              vote_average: item.vote_average,
            };
          });

          setMovies(fetchedItems);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint]);

  return [movies, isLoading];
};

export default useFetchMovies;
