"use client";

import React, { useState, useEffect } from "react";
import CompanyCard from "../addCompanyCard/addCompanyCard";
import styles from "./companies.module.css";

const Companies = ({ username }) => {
  const [companyData, setCompanyData] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:80/users/${username}/companies`
      );
      if (response.ok) {
        const data = await response.json();
        setCompanyData(data);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleUpdate = async (updatedCompany) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:80/company/${updatedCompany.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCompany),
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          fetchCompanies();
        } else {
          console.error("Failed to update job");
        }
      } catch (error) {
        console.error("Error updating job:", error);
      }
  };

  const handleAddCompany = async () => {
    const newCompany = {
      name: "Click Me to Edit",
      location: "",
      rating: "",
      id: -1
    };

    try {
      const response = await fetch(`http://127.0.0.1:80/company/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      });

      if (response.ok) {
        const data = await response.json();
        fetchCompanies();
      } else {
        const errorData = await response.json(); // Extract JSON error data
        alert(errorData.error);
        console.error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  

  useEffect(() => {
    if (username) fetchCompanies();
  }, [username]);

  return (
    <div>
      <button onClick={handleAddCompany} className={styles.addCompanyButton}>
        Add Company
      </button>
      <div className={styles.cardContainer}>
        {companyData.map((company, index) => (
          <CompanyCard
            key={company.id}
            companyData={company}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
