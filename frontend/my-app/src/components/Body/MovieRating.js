import React, { useState, useRef, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from "./MovieRating.module.css";
import { getRating, createRating, updateRating, deleteRating } from '../../services/ratingService';
import { verifyToken, getTokenFromCookie } from '../../services/tokenService';
import jwt_decode from "jwt-decode";

const MovieRating = (props) => {
  const [rating, setRating] = useState(null);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [hover, setHover] = useState(null);
  const ratingRef = useRef();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const tokenVerificationResult = await verifyToken();
      setIsLoggedIn(tokenVerificationResult.isValid);
      if (tokenVerificationResult.isValid) {
        const token = getTokenFromCookie();
        const decoded = jwt_decode(token);
        setUserId(decoded.id);
        setUsername(decoded.username);
      }
    };
    checkTokenValidity();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      if (isLoggedIn && username) {
        const fetchedRating = await getRating(username, props.movieID);
        setRating(fetchedRating ? fetchedRating.rating : null);
      }
    };
    fetchRating();
  }, [isLoggedIn, username, props.movieID]);

  const handleRatingSubmit = async (newRating) => {
    if (userId && username && props.movieID) {
      const existingRating = await getRating(username, props.movieID);
      if (existingRating) {
        if (newRating === null) {
          await deleteRating(userId, props.movieID);
        } else {
          await updateRating(userId, props.movieID, newRating);
        }
      } else if (newRating !== null) {
        await createRating(userId, username, newRating, props.movieID);
      }
      setRating(newRating);
    }
  };
  

  const handleClick = (e) => {
    if (ratingRef.current.contains(e.target)) {
      return;
    }
    setIsRatingVisible(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className={styles.ratingContainer} ref={ratingRef}>
      <div
        className={styles.ratingTrigger}
        onClick={() => setIsRatingVisible(!isRatingVisible)}
      >
        {rating ? (
          <>
            <FaStar color="#ffc107" />
            <span>{rating}</span>
          </>
        ) : (
          <>
            <FaStar color="#ffc107" />
            <span>Rate</span>
          </>
        )}
      </div>
      {isRatingVisible && (
        <div className={styles.ratingStars}>
          {[...Array(10)].map((_, i) => (
            <FaStar
              key={i}
              className={styles.star}
              onClick={() => {
                const newRating = (i + 1) === rating ? null : i + 1;
                handleRatingSubmit(newRating);
              }}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(null)}
              color={i < (hover || rating) ? '#ffc107' : '#e4e5e9'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieRating;