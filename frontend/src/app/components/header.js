import React from "react";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className = {styles.main}>
      <h2 className = {styles.titleHeader}>Nest v.0.1 - An application made by A.R.C.</h2>
    </div>
  );
};

export default Header;
