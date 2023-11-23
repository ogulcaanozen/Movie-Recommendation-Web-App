import React from "react";
import SearchBar from "./Search Bar/SearchBar";
import "./Header.css";
import LogIn from "./LogIn";

function Header(){
    return(
        <React.Fragment>
            <header>
                <nav className="pages">
                    <ul>
                        <li className="page"><a className="page" href="/">Home</a></li>
                        <li className="page"><a className="page" href="/recommendations">Recommender</a></li>
                        <SearchBar />
                        <li className="page login"><LogIn className="login"/></li>
                        
                    </ul>
                </nav>
            </header>
        </React.Fragment>
    )
}

export default Header;