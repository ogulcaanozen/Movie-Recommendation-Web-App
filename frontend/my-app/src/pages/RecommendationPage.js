import React, { useState, useEffect,useContext } from "react";
import styles from "./RecommendationPage.module.css"
import RatedMovies from "../recommendations/RatedMovies";
import RecommendedMovie from "../recommendations/RecommendedMovie";
import Header from "../components/Header/Header";
import {getRatedMovies} from "./../services/ratedMoviesService";
import { getTokenFromCookie} from "../services/tokenService";
import { MyContext } from '../context/Context';
import { getUserRecommendations, getCollaborativeRecommendations, getClusteringRecommendations} from "./../services/recommendationService";
import jwt_decode from 'jwt-decode';
import { verifyToken } from '../services/authService';

function RecommendationPage(){
    const [userId, setUserId] = useState(null);
    const [ratedMovies, setRatedMovies] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [displayCount, setDisplayCount] = useState(8); //New State
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(false); //New State
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [minSimilarity, setMinSimilarity] = useState(0);
    const [method, setMethod] = useState('content-based'); // default method is content-based
    const { isLoggedIn, setIsLoggedIn} = useContext(MyContext);

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
        const fetchRatedMovies = async () => {
            checkLoginStatus();
            const token = getTokenFromCookie();
            if (token) {
                const decoded = jwt_decode(token);
                if (decoded && decoded.id) {
                    setUserId(decoded.id);
                    const movies = await getRatedMovies(decoded.id);
                    setRatedMovies(movies);
        
                    let recommendedMovies;
                    // Choose the method for getting recommendations
                    if (method === 'content-based') {
                        recommendedMovies = await getUserRecommendations(decoded.id);
                        
                    } else if (method === 'item-item') {
                        recommendedMovies = await getCollaborativeRecommendations(decoded.id);
                        console.log("collaborative: " + JSON.stringify(recommendedMovies, null, 2));
                    } else if(method === "clustering") {
                        recommendedMovies = await getClusteringRecommendations(decoded.id);
                        console.log("clustering: " + JSON.stringify(recommendedMovies, null, 2));
                    }
        
                    setRecommendedMovies(recommendedMovies);
                    setShowLoadMoreButton(recommendedMovies.length > 8);
                }
            }
        };
    
        fetchRatedMovies();
    }, [userId, selectedGenres, method]);
    

    const handleMethodChange = (e) => {
        setMethod(e.target.value);
    }
    

    const handleGenreChange = (e) => {
        if(e.target.checked) {
            setSelectedGenres([...selectedGenres, e.target.name]);
        } else {
            setSelectedGenres(selectedGenres.filter(genre => genre !== e.target.name));
        }
    }
    
    const handleMinSimilarityChange = (e) => {
        setMinSimilarity(e.target.value);
    }

    const loadMore = () => {
        setDisplayCount(displayCount + 8);
        setShowLoadMoreButton(recommendedMovies.length > displayCount + 8); // Determine if there are more than current display count + 8
    }

    if (!ratedMovies) {
        return <p>Loading...</p>;
    }

    return(
        <React.Fragment>
            <Header />
            <div className={styles["mainContainter"]}>
                <div className={styles["ratedMovies"]}>
                    <p>My Rated Movies</p>
                    {ratedMovies.map(movie => (
                        <RatedMovies key={movie.movie_id} movieID={movie.movie_id} />
                    ))}
                </div>
                <div className={styles["recommendationsContainer"]}>
                    <p>Recommendations</p>
                    <div className={styles["recommendations"]}>
                    {
                        recommendedMovies
                            .filter(movie => selectedGenres.every(selectedGenre => movie.genres.includes(selectedGenre)))
                            .filter(movie => method === 'content-based' ? movie.probability_percentage >= minSimilarity : true)
                            .reduce((acc, current) => {
                                const x = acc.find(item => item.movie_id === current.movie_id);
                                if (!x) {
                                return acc.concat([current]);
                                } else {
                                return acc;
                                }
                            }, [])
                            .slice(0, displayCount)
                            .map(movie => {
                                return <RecommendedMovie 
                                            movieID={movie.movie_id} 
                                            similarity={movie.probability_percentage} 
                                            method={method} 
                                            basedOnMovieId={movie.based_on_movie_id} 
                                        />                          
                            })
                    }


                    </div>
                    {
                        showLoadMoreButton && (
                            <button onClick={loadMore} className={styles["LoadButton"]}>Load More</button>
                        )
                    }
                </div>
                <div className={styles["settings"]}>
                    <p>Settings</p>
                    <label for="genre-select">Choose a method:</label>
                    <select id="genre-select" onChange={handleMethodChange}>
                        <option value="content-based">Content Based</option>
                        <option value="item-item">Item-Item Collaborative</option>
                        <option value="clustering">K means Clustering</option>
                    </select>

                    <fieldset>
                        <legend>Choose genres</legend>

                        <div className="genre">
                            <input type="checkbox" id="Action" name="Action" onChange={handleGenreChange}/>
                            <label for="Action">Action</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Science Fiction" name="Science Fiction" onChange={handleGenreChange}/>
                            <label for="Science Fiction">Sci-Fi</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Romance" name="Romance" onChange={handleGenreChange}/>
                            <label for="Romance">Romance</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Comedy" name="Comedy" onChange={handleGenreChange}/>
                            <label for="Comedy">Comedy</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Horror" name="Horror" onChange={handleGenreChange}/>
                            <label for="Horror">Horror</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Adventure" name="Adventure" onChange={handleGenreChange}/>
                            <label for="Adventure">Adventure</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Fantasy" name="Fantasy" onChange={handleGenreChange}/>
                            <label for="Fantasy">Fantasy</label>
                        </div>
                        <div className="genre">
                            <input type="checkbox" id="Mystery" name="Mystery" onChange={handleGenreChange}/>
                            <label for="Mystery">Mystery</label>
                        </div>
                    </fieldset>
                    {method === 'content-based' && (
                        <div className={styles["SimilarityContainer"]}>
                            <label htmlFor="min-similarity">Minimum Similarity:</label>
                            <input type="number" id="min-similarity" name="min-similarity" min="10" max="100" onChange={handleMinSimilarityChange}></input>
                        </div>
                        )}

                    
                </div>
            </div>
        </React.Fragment>
    )
}

export default RecommendationPage;
