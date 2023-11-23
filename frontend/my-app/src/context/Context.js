import React, { createContext, useState, useEffect } from 'react';


const MyContext = createContext({
  isLoggedIn: false,
  shows: [],
  setIsLoggedIn: () => {},
  setShows: () => {},
  setShowVideoList: () => {},
});

const MyContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shows, setShows] = useState([]);
  const [showVideoList, setShowVideoList] = useState(false);

  
  

  const value = {
    isLoggedIn,
    shows,
    setIsLoggedIn,
    setShows,
    setShowVideoList,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};


export { MyContext, MyContextProvider };
