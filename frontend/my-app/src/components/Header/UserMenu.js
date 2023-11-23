import React from "react";
import UserMenuItem from "./UserMenuItem";
import "./UserMenu.css";

function UserMenu(){
    return(
        <React.Fragment>
            <div className="main-container">
                <UserMenuItem option="Your Settings" />
                <UserMenuItem option="Sign Out" />
            </div>
        </React.Fragment>
    );
}

export default UserMenu;