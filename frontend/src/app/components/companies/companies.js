"use client";
import React, { useEffect, useState } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      jobName: `Job ${i + 1}`,
      salary: "$120,000.00",
      progress: `${(i + 1) * 5}%`,
      title: "Frontend Developer",
      skills: "React, TypeScript, CSS",
      requirements: "3+ years experience",
    }));

    setCompanies(mockData);
  }, []);

  const handleUpdate = (updatedCompany) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === updatedCompany.id ? updatedCompany : comp))
    );
    // TODO: make API call here
  };

  return (
    <div className={styles.container}>
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          {...company}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default Companies;
