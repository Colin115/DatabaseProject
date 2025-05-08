import React from "react";
import Link from "next/link";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <nav className={styles.invisible}>
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
      <div className={styles.main}>
        <h2 className={styles.titleHeader}>
          Nest v.0.1 - An application made by A.R.C.
        </h2>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>
    </div>
  );
};

export default Header;
