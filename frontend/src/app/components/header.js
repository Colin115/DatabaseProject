import React from "react";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div>
      <h1 className = {styles.title}><center>Nest</center></h1>
      <span className = {styles.subtitle}><center>By A.R.C.</center></span>
      <div className = {styles.button}>
      <button className={styles.button1}>Login</button>
      <button className={styles.button2}>Sign Up</button>
      </div>
    </div>
  );
};

export default Header;
