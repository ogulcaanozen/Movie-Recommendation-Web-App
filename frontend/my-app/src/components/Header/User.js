import React, { useContext } from 'react';
import { MyContext } from '../../context/Context';
import "./LogIn.css";
import UserIcon from "./../../images/user.png";


function User(){

    const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);

    function clickHandler(){
        setIsLoggedIn(false);
    }

    return(
        <React.Fragment>
            <div className="login-container">
                <div className="user-image-container">
                    <img className="user-image" src={UserIcon}/>
                </div>
                <p>Hello user</p>
                <div>
                <a className="signOutText" onClick={clickHandler} >Sign Out</a>
                </div>
            </div>
            
        </React.Fragment>
        
    );
}

export default User;
