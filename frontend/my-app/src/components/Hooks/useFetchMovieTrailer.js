import { useState, useEffect } from 'react';

function useMovieVideos(movie_id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '9cec5129d32cd0fc174b0a5bdea0e726';
  const language = 'en-US';

  useEffect(() => {
    const fetchMovieVideos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${apiKey}&language=${language}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const jsonResponse = await response.json();
        setData(jsonResponse);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchMovieVideos();
  }, [movie_id]);

  return { data, isLoading, error };
}

export default useMovieVideos;
