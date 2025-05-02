"use client";
import { useState } from "react";
import { useRouter  } from 'next/navigation';
import styles from "./page.module.css";
import Header from "../components/header";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:80/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

      router.push(`/profile/${formData.username}`);

      //redirect(`/profile/colin1`);
      // Optionally redirect to login
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create an Account</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <article className={styles.formItem}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="johndoe123"
                value={formData.username}
                onChange={handleChange}
              />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </article>
            <article className={styles.formItem}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
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
