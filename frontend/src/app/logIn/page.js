import Image from "next/image";
import styles from "./page.module.css";
import Header from "../components/header";
import Head from "next/head";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome Back</h1>
          <form className={styles.form}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="you@example.com" />

            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" />

            <button className={styles.button} type="submit">
              Log In
            </button>
          </form>
          <p className={styles.signup}>
            Don't have an account? <a href="/signUp">Sign up</a>
          </p>
        </div>
      </main>
    </div>
  );
}
