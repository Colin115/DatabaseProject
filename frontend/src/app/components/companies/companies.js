"use client";
import React, { useState, useEffect } from "react";
import CompanyCard from "../companyCard/companyCard";
import styles from "./Companies.module.css";

const Companies = ({ username }) => {
  const [companies, setCompanies] = useState([]);
  const [rcompanies, setRCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [filterType, setFilterType] = useState("none");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [aggregation, setAggregation] = useState();

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:80/jobs/${username}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.jobs);
        setAggregation({
          total: data.total_jobs,
          avgSalary: data.average_salary,
          maxSalary: data.highest_salary,
          minSalary: data.lowest_salary,
        });
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
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
        if (filterType === "none") {
          fetchJobs();
        } else {
          fetchFilteredJobs();
        }
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

        if (filterType === "none") {
          fetchJobs();
        } else {
          fetchFilteredJobs();
        }
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
        if (filterType === "none") {
          fetchJobs();
        } else {
          fetchFilteredJobs();
        }
        console.log("Job deleted successfully");
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const fetchFilteredJobs = async () => {
    const formData = {
      company: filterType === "company" ? selectedCompany : undefined,
      minSalary: filterType === "salary" ? minSalary : undefined,
      maxSalary: filterType === "salary" ? maxSalary : undefined,
      title: jobTitle || undefined,
      skills: skills || undefined,
      sort_by: sortBy !== "none" ? sortBy : undefined,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:80/user/${username}/jobs/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.jobs);
        setAggregation({
          total: data.total_jobs,
          avgSalary: data.average_salary,
          maxSalary: data.highest_salary,
          minSalary: data.lowest_salary,
        });
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchJobs();
      fetchCompanies();
    }

    if (
      filterType ||
      selectedCompany ||
      maxSalary ||
      minSalary ||
      jobTitle ||
      skills ||
      sortBy
    ) {
      fetchFilteredJobs();
    }
  }, [
    username,
    filterType,
    selectedCompany,
    maxSalary,
    minSalary,
    jobTitle,
    skills,
    sortBy,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.jobHeader}>
        <div>
          <label>Sort By</label>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            <option value="salary_asc">Salary Ascending</option>
            <option value="salary_desc">Salary Descending</option>
          </select>
        </div>
        <div>
          <label>Filter</label>
          <select
            className={styles.filterDropdown}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="none">None</option>
            <option value="company">Company</option>
            <option value="salary">Salary Range</option>
            <option value="title">Job Title</option>
            <option value="skills">Skills</option>
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
            <div>
              <input
                type="number"
                placeholder="Min Salary"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Salary"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>
          )}

          {filterType === "title" && (
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          )}

          {filterType === "skills" && (
            <input
              type="text"
              placeholder="Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          )}
        </div>
        <div>
          {aggregation && (
            <div className={styles.aggregation}>
              <p>Total Jobs: {aggregation.total || 0}</p>
              <p>Average Salary: {Number(aggregation.avgSalary || 0).toFixed(2)}</p>
              <p>Highest Salary: {aggregation.maxSalary || 0}</p>
              <p>Lowest Salary: {aggregation.minSalary || 0}</p>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleAddJob} className={styles.addJobButton}>
        Add Job
      </button>

      <div>
        <button onClick={fetchFilteredJobs}>Apply Filters</button>
      </div>

      <div className={styles.cardsContainer}>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            username={username}
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
