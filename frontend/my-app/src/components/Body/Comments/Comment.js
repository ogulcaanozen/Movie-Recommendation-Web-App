import React from 'react';

const Comment = (props) => {
  const { username, date, comment, isLast } = props;

  const dateStyle = {
    color: 'black',  // Changed color to white
    marginBottom: '10px',
  };

  const commentStyle = isLast
    ? {}
    : {
        borderBottom: '1px solid gray',
        paddingBottom: '10px',
        marginBottom: '10px',
        
      };

  const textStyle = {
    color: 'black', 
  };

  return (
    <div style={commentStyle}>
      <h3 style={textStyle}>{username}</h3>
      <p style={dateStyle}>{date}</p>
      <p style={textStyle}>{comment}</p>  
    </div>
  );
};

export default Comment;

