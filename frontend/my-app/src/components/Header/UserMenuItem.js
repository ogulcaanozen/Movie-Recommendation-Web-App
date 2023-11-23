import React from "react";

import classes from "./UserMenuItem.module.css";


function UserMenuItem(props){
    return(
        <React.Fragment>
            <div className={classes['container']}>
                <p>{props.option}</p>
            </div>
        </React.Fragment>
    );
}

export default UserMenuItem;