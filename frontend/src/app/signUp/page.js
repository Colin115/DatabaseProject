import styles from "./page.module.css";
import Header from "../components/header";

export default function SignUp() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an Account</h1>
          <form className={styles.form}>
            <article className={styles.formItem}>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" placeholder="John" />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" placeholder="johndoe123" />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
              />
            </article>

            <button className={styles.button} type="submit">
              Sign Up
            </button>
          </form>
          <p className={styles.signup}>
            Already have an account? <a href="/">Log in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
