"use client";
import React, { useState } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddJob, setShowAddJob] = useState(false);

  const handleAddJob = () => {
    const newJob = {
      id: Date.now(), 
      jobName: `Job ${companies.length + 1}`,
      salary: "$120,000.00",
      progress: "0%",
      title: "Frontend Developer",
      skills: "React, TypeScript, CSS",
      requirements: "3+ years experience",
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