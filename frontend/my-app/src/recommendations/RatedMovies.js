import React,  {useState, useEffect} from "react";
import styles from "./RatedMovies.module.css"
import useFetchDetailData from "./../components/Hooks/useFetchDetail"
import MovieRating from "../components/Body/MovieRating";
import { getTokenFromCookie, verifyToken } from "../services/tokenService";
import jwt_decode from 'jwt-decode';

function RatedMovies(props){
    const [userId, setUserId] = useState(null);
    const [userName,setUserName] = useState(null);
    const movieData = useFetchDetailData(props.movieID);
    
    
    useEffect(() => {
        if(movieData) {
            console.log(movieData);
        }
    }, [movieData]);

    useEffect(()=>{
        const token = getTokenFromCookie();
        if (token) {
            const decoded = jwt_decode(token);
            console.log("decoded:", decoded); //checking 2
            setUserId(decoded.id);
            setUserName(decoded.username);
        }
    },[])

    if (!movieData) {
        return <div>Loading...</div>; // or some other placeholder
    }

    return(
        <React.Fragment>
            <div className={styles["mainContainer"]}>
                <div>
                    <img src={"https://image.tmdb.org/t/p/w500"+movieData.posterPath} className={styles.poster}></img>
                </div>
                <div>
                    <h3>{movieData.originalTitle}</h3>
                    <p>{movieData.releaseDate} | {movieData.genres.map((genre)=>{
                        return genre.name+" ";})}
                    </p>
                    <div className={styles.rating}>
                        <MovieRating username={userName} userID={userId} movieID={props.movieID} />
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    )
}

export default RatedMovies;
