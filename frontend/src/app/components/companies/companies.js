"use client";
import React, { useState } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = ({ resumes }) => {
  const [companies, setCompanies] = useState([]);
  const [showAddJob, setShowAddJob] = useState(false);

  const handleAddJob = () => {
    const newJob = {
      id: Date.now(), 
      jobName: `Click Me to Edit`,
      salary: "",
      progress: "",
      title: "",
      skills: "",
      requirements: "",
    };
    setCompanies((prev) => [...prev, newJob]);
    setShowAddJob(true);
  };

  const handleUpdate = (updatedCompany) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === updatedCompany.id ? updatedCompany : comp))
    );
  };

  const handleRemove = (idToRemove) => {
    setCompanies((prev) => prev.filter((comp) => comp.id !== idToRemove));
  };

  return (
    <div className={styles.container}>
      <button onClick={handleAddJob} className={styles.addJobButton}>
        Add Job
      </button>
      {showAddJob && (
        <div className={styles.cardsContainer}>
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              {...company}
              resumes={resumes || []} 
              onUpdate={handleUpdate}
              onRemove={() => handleRemove(company.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;