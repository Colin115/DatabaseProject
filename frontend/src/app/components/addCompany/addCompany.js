"use client";

import React, { useState, useEffect } from "react";
import CompanyCard from "../addCompanyCard/addCompanyCard";
import styles from "./companies.module.css";

const Companies = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [companyData, setCompanyData] = useState({ name: "", location: "", rating: "" });

  const dummyCompanies = [
    { name: "TechCorp", location: "San Francisco, CA", rating: "4.5" },
    { name: "GreenLeaf", location: "Austin, TX", rating: "4.2" },
    { name: "Skyline Solutions", location: "New York, NY", rating: "4.8" }
  ];

  return (
    <div>
      <div className={styles.cardContainer}>
        {dummyCompanies.map((company, index) => (
          <CompanyCard
            key={index}
            companyData={company}
            setPopupOpen={setPopupOpen}
            setCompanyData={setCompanyData}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;

