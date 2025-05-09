"use client";
import React, { useState, useEffect } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = ({ username }) => {
  const [companies, setCompanies] = useState([]);
  const [rcompanies, setRCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [filterType, setFilterType] = useState("None");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [showAddJob, setShowAddJob] = useState(false);

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
        fetchJobs();
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

  const handleUpdateCompany = (jobId, companyName) => {
    fetchJobs();
  };

  const handleUpdateResume = (jobId, resumeId) => {
    setCompanies((prev) =>
      prev.map((comp) =>
        comp.id === jobId ? { ...comp, selectedResume: resumeId } : comp
      )
    );
  };

  const handleRemove = async (idToRemove) => {
    try {
      const response = await fetch(`http://127.0.0.1:80/jobs/${idToRemove}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchJobs();
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:80/users/${username}/companies`
      );
      if (response.ok) {
        const data = await response.json();
        setRCompanies(data);
      } else {
        console.error("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchFilteredJobs = async () => {
    var formData = {};

    if (filterType === "company") {
      formData = {
        company: selectedCompany
      }
    }
    else if (filterType == "salary") {
      formData = {
        minSalary: minSalary,
        maxSalary: maxSalary
      }
    }

    console.log(formData)

      try {
        const response = await fetch(`http://127.0.0.1:80/user/${username}/jobs/filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
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

  const handleFilterChange = () => {
    if (filterType === "none") {
      fetchJobs();
      return;
    }

    fetchFilteredJobs();
  };

  useEffect(() => {
    if (username) fetchJobs();
    if (selectedCompany) handleFilterChange();
    if (username) fetchCompanies();
    if (filterType) handleFilterChange();
    if (minSalary) handleFilterChange();
    if (maxSalary) handleFilterChange();
  }, [username, selectedCompany, filterType, minSalary, maxSalary]);

  return (
    <div className={styles.container}>
      <button onClick={handleAddJob} className={styles.addJobButton}>
        Add Job
      </button>

      <div>
        <select
          className={styles.filterDropdown}
          value={filterType}
          onChange={(e) => {
            e.stopPropagation();
            setFilterType(e.target.value)
          }}
        >
          <option value="" disabled>
            Filter by
          </option>
          <option value="none">None</option>
          <option value="company">Company</option>
          <option value="salary">Salary Range</option>
        </select>

        {filterType === "company" && (
          <select
            onChange={(e) => setSelectedCompany(e.target.value)}
            className={styles.companyDropdown}
            value={selectedCompany}
          >
            <option value="" disabled>
              Select Company
            </option>
            {rcompanies.map((company) => (
              <option key={company.id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        )}

        {filterType === "salary" && (
          <div className={styles.salaryInputContainer}>
            <label>Min Salary:</label>
            <input
              type="number"
              placeholder="Min"
              className={styles.salaryInput}
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <label>Max Salary:</label>
            <input
              type="number"
              placeholder="Max"
              className={styles.salaryInput}
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className={styles.cardsContainer}>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            username={username}
            {...company}
            onUpdate={handleUpdate}
            onUpdateResume={handleUpdateResume}
            onUpdateCompany={handleUpdateCompany}
            onRemove={() => handleRemove(company.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
