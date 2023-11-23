import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import useFetchDetail from "./../components/Hooks/useFetchDetail"; 
import styles from "./ShowDetail.module.css";
import MovieRating from "../components/Body/MovieRating";
import Comments from "../components/Body/Comments/Comments";
import { postComment } from "./../services/commentService";
import { getTokenFromCookie, verifyToken } from "../services/tokenService";
import jwt_decode from 'jwt-decode';
import Header from "../components/Header/Header";

function ShowDetail(){
    const { id } = useParams();
    const movieData = useFetchDetail(id);
    const [userComment, setUserComment] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName,setUserName] = useState(null);

    useEffect(() => {
        const checkTokenValidity = async () => {
          const tokenVerificationResult = await verifyToken();
          setIsLoggedIn(tokenVerificationResult.isValid);
        };
        checkTokenValidity();
      }, []);


      const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = getTokenFromCookie();
          console.log("token:"+token); //checking 1
          if (token) {
            const decoded = jwt_decode(token);
            console.log("decoded:", decoded); //checking 2
            await setUserId(decoded.id);
            await setUserName(decoded.username);
          }
          const commentData = {
            user_id: userId,
            username: userName,
            movie_id: id,
            comment: userComment,
          };
          console.log("comment data:" +commentData);
          await postComment(commentData);
          setUserComment('');
          alert('Comment submitted successfully');
        } catch (error) {
          console.error('Comment submission error:', error);
          alert('Failed to submit comment');
        }
      };

    if (!movieData) {
        return <div>Loading...</div>;
    }

    const genres = movieData.genres.map((genre) => {
        return genre.name;
    })


    return(
        <React.Fragment>
            <Header />
            <div className={styles.mainContainer}>
                <div className={styles.imageContainer}>
                    <img src={"https://image.tmdb.org/t/p/w500"+movieData.posterPath} className={styles.poster}></img>
                </div>
                <div className={styles.detailContainer}>
                    <h2>{movieData.originalTitle}</h2>
                    <p>{movieData.releaseDate} - {genres.map((genre, index, array) => {
                        return(
                            <span key={index}>
                                {genre}
                                {index !== array.length - 1 && " , "}
                            </span>
                        )
                    })} - {movieData.voteAverage} - <MovieRating username={userName} userID={userId} movieID={id}/> </p>
                    <h3>Overview</h3>
                    <p>{movieData.overview}</p>
                    <h3>Cast</h3>
                    <p>
                        {movieData.names.slice(0,5).map((name, index, array) =>{
                            return (
                                <span key={index}>
                                    {name} 
                                    {index !== array.length - 1 && " - "}
                                </span>
                            );
                        })}
                    </p>

                    
                </div>
            </div>
            <div className={styles["commentContainer"]}>
                {isLoggedIn && (
                        <div className={styles.commentForm}>
                            <div className={styles.Comments}>
                                <Comments movieID={id} />
                            </div>
                            <h2>Leave a comment:</h2>
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    className={styles.commentInput}
                                    name="comment"
                                    id="comment"
                                    rows="4"
                                    placeholder="Write your comment here..."
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                ></textarea>
                                <button className={styles.commentButton} type="submit">Submit</button>
                            </form>
                        </div>
                    )
                }
            </div>
                
        </React.Fragment>
    );
}


export default ShowDetail;