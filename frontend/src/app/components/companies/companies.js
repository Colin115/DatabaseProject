"use client";
import React, { useState, useEffect } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = ({ username }) => {
  const [companies, setCompanies] = useState([]);
  const [showAddJob, setShowAddJob] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:80/jobs/${username}`);
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (username) fetchJobs();
  }, [username]);

  const handleAddJob = async () => {
    const newJob = {
      salary: 0,
      requirements: "",
      skills: "",
      title: "Click Me to Edit",
      progress: "",
    };

    try {
      const response = await fetch(`http://127.0.0.1:80/jobs/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        const createdJob = await response.json();
        setCompanies((prev) => [...prev, createdJob]);
        setShowAddJob(true);
      }
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleUpdate = async (updatedJob) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:80/jobs/${updatedJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedJob),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanies((prev) =>
          prev.map((comp) => (comp.id === data.id ? data : comp))
        );
      } else {
        console.error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleRemove = async (idToRemove) => {
    try {
      const response = await fetch(`http://127.0.0.1:80/jobs/${idToRemove}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCompanies((prev) => prev.filter((comp) => comp.id !== idToRemove));
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleAddJob} className={styles.addJobButton}>
        Add Job
      </button>
      <div className={styles.cardsContainer}>
        {companies.map((company) => (
          <CompanyCard
            username={username}
            key={company.id}
            {...company}
            onUpdate={handleUpdate}
            onRemove={() => handleRemove(company.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
