"use client";
import React, { useState, useEffect } from "react";

import styles from "./page.module.css";
import Header from "../../components/header";
import Companies from "../../components/companies/companies";
import Resumes from "../../components/resumes/resumes";
import AddCompany from "../../components/addCompany/addCompany"

export default function Profile({ params }) {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState({
    fname: "loading",
    lname: "loading",
    email: "loading",
    title: "loading",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:80/get_user/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const getUsernam = async () => {
      const { username } = await params;
      setUsername(username);
    }

    getUsernam();
    if (username) {
      fetchUserInfo();
    }
  }, [username]);

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.profileHeader}>
        <h2>{userData.fname}'s Profile</h2>
        <p>
          <strong>Name:</strong> {userData.fname} {userData.lname}
        </p>
        <p>
          <strong>Username:</strong> {username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.column}>
          <h3>Jobs</h3>
          <Companies username={username} />
        </div>
        <div className={styles.column}>
          <h3>Resumes</h3>
          <Resumes username={username} />
        </div>
        <div className={styles.column}>
          <h3>Companies</h3>
          <AddCompany username={username} />
        </div>
      </div>
    </div>
  );
}
