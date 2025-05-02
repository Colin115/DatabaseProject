"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/header";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:80/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");
      router.push(`/profile/${formData.username}`);
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
          <h1 className={styles.title}>Welcome Back</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="username">Username</label>
            <input
              alue={formData.username}
              onChange={handleChange}
              type="username"
              id="username"
              placeholder="username"
            />

            <label htmlFor="password">Password</label>
            <input
              alue={formData.password}
              onChange={handleChange}
              type="password"
              id="password"
              placeholder="••••••••"
            />

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
