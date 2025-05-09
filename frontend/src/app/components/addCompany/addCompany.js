"use client";

import React, { useState, useEffect } from "react";
import CompanyCard from "../addCompanyCard/addCompanyCard";
import styles from "./companies.module.css";

const Companies = () => {
  const [companyData, setCompanyData] = useState([]);

  const handleUpdate = async (updatedJob) => {
    setCompanyData((prev) =>
      prev.map((comp) => (comp.name === updatedJob.name ? updatedJob : comp))
    );
  };
  const handleAddCompany = async () => {
    const newCompany = {
      name: "Click Me to Edit",
      location: "",
      rating: "",
    };
    setCompanyData((prev) => [...prev, newCompany]);


    // try {

    //   const response = await fetch(
    //     `http://127.0.0.1:80/jobs/${updatedJob.id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(updatedJob),
    //     }
    //   );

    //   if (response.ok) {
    //     const data = await response.json();

    //   } else {
    //     console.error("Failed to update job");
    //   }
    // } catch (error) {
    //   console.error("Error updating job:", error);
    // }
  };

  return (
    <div>
      <button onClick={handleAddCompany} className={styles.addCompanyButton}>
        Add Company
      </button>
      <div className={styles.cardContainer}>
        {companyData.map((company, index) => (
          <CompanyCard
            key={index}
            companyData={company}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
