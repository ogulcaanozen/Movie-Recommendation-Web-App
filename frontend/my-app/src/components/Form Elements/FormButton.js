import React from "react";
import styles from "./FormButton.module.css"

function FormButton(props){
    return (
        <button type="submit" className={styles.ReusableButton} onClick={props.clickHandler} style={{ backgroundColor: props.backgroundColor }}>
            {props.text}
        </button>
    );
}

export default FormButton;