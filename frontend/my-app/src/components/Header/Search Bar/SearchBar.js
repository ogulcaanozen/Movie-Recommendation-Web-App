import React from "react";
import SearchForm from "./SearchForm";
import classes from "./SearchBar.module.css"

function SearchBar(){
    return(
        <React.Fragment>
            <div className={classes['search-container']}>
                <SearchForm />
            </div>
        </React.Fragment>
        
    );
}

export default SearchBar;