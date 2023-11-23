import React,{useContext, useEffect, useState} from "react";
import useFetchPosters from "../../Hooks/useFetchPosters";
import MovieTrailer from "./MovieTrailer";
import MovieImg from "./MovieImg";
import { MyContext } from './../../../context/Context';
import slideLeft from "./../../../images/slideToLeft.png";
import slideRight from "./../../../images/slideToRight.png";
import classes from "./VideoList.module.css";

function VideoList(props){
    const [posterNum, setPosterNum] = useState(0);
    const [displayTrailer,setDisplayTrailer] = useState(false);
    const myCtx = useContext(MyContext);
    const { moviePosters, movieKeys, isLoading } = useFetchPosters(myCtx.shows);

    function handleDisplayTrailer(isDisplaying){
        setDisplayTrailer(isDisplaying);
    }


    const handleSlideLeftClick = () => {
        if(posterNum === 0){
            setPosterNum(7);
        }
        else{
            setPosterNum(posterNum-1);
        }
    };

    const handleSlideRightClick = () => {
        if(posterNum === 7){
            setPosterNum(0);
        }
        else{
            setPosterNum(posterNum+1);
        }
    };
    
    useEffect(() => {
        console.log(myCtx.shows);
    },[myCtx]);
    

    return(
        <React.Fragment>
            <div className={classes["main-container"]}>
                <img className={classes["slide"]} alt="Slide Left" onClick={handleSlideLeftClick} src={slideLeft}/>
                <MovieImg source={isLoading ? <p>Loading..</p> : moviePosters[posterNum]}  displayTrailer={handleDisplayTrailer}/>
                <img className={classes["slide"]} alt="Slide Right" onClick={handleSlideRightClick} src={slideRight}/>
                {displayTrailer && <MovieTrailer displayTrailer={handleDisplayTrailer} trailerKeys={movieKeys[posterNum]} />}
            </div>
            
        </React.Fragment>
    );
}

export default VideoList;