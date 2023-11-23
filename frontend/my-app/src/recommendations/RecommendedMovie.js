import React,  {useEffect} from "react";
import styles from "./RecommendedMovie.module.css";
import useFetchDetailData from "./../components/Hooks/useFetchDetail";
import percentIcon from "./../images/percentage.png"

function RecommendedMovie(props){
    const movieData = useFetchDetailData(props.movieID);
    const basedMovie = useFetchDetailData(props.basedOnMovieId);

    if (props.method === 'item-item' && (!movieData || !basedMovie)) {
        return <div>Loading...</div>; // or some other placeholder
    }

    if (props.method === 'content-based' && !movieData) {
        return <div>Loading...</div>; // or some other placeholder
    }

    const posterPath = movieData?.posterPath || "Movie Poster"; // New line

    return (
        <React.Fragment>
            <div className={styles["mainContainer"]}>
                <img src={"https://image.tmdb.org/t/p/w500"+posterPath} className={styles.poster}></img>
                <h4>{movieData?.originalTitle || 'Title Not Available'}</h4>
                <p className={styles["movieDetails"]}>{movieData?.releaseDate || 'N/A'} | {movieData?.genres?.map((genre)=>{
                    return genre.name+" ";}) || 'N/A'}</p>
                <div className={styles["similarityContainer"]}>
                    {props.method === 'content-based' && 
                    <React.Fragment>
                        
                        <p>SIMILARITY SCORE: {props.similarity}</p>  
                    </React.Fragment>
                    }
                    {props.method === 'item-item' && basedMovie &&
                    <React.Fragment>
                        <p>Because you liked this movie: {basedMovie?.originalTitle || 'Title Not Available'}</p>  
                    </React.Fragment>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default RecommendedMovie;
