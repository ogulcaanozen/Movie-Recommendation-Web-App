import React from "react";
import StarImage from "./../../images/star.png"
import classes from "./Rating.module.css"

function Rating(props){
    return(
        <React.Fragment>
            <div className={classes["rating-container"]}>
                <img src={StarImage}/>
                <p>{props.rating}</p>
            </div>
        </React.Fragment>
    );
}

export default Rating;