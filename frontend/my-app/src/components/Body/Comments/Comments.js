import React, {useState, useEffect} from 'react';
import Comment from './Comment';
import { getCommentsByMovieID } from "./../../../services/commentService.js"

const Comments = (props) => {
  const { movieID } = props;
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getCommentsByMovieID(movieID);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [movieID]);

  return (
    <div>
      {comments.map((commentData, index) => (
        <Comment
          key={commentData.date + commentData.username}
          username={commentData.username}
          date={commentData.date}
          comment={commentData.comment}
          isLast={index === comments.length - 1}
        />
      ))}
    </div>
  );
};

export default Comments;
