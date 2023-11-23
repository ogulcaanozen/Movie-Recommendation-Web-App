import React, {useContext} from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./../../context/Context";
import "./LogIn.css";
import User from "./User"


function LogIn(){
    const ctx = useContext(MyContext);
    const navigate = useNavigate();

    function clickHandler(){
        navigate("/login");
    }

    const content = ctx.isLoggedIn ? <User /> : <div className="login-container" onClick={clickHandler}><p>Log In</p></div>

    return(
        <React.Fragment>
            <div className="container">
                {content}
            </div>
        </React.Fragment>
    );
}

export default LogIn;