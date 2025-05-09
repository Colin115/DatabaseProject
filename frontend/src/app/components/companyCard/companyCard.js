"use client";
import { useState, useEffect } from "react";
import styles from "./companyCard.module.css";
import Popup from "../companyPopup/popup";

export default function CompanyCard({
  id,
  username,
  jobName,
  salary,
  progress,
  title,
  skills,
  requirements,
  selectedResume,
  selectedCompany,
  onUpdate,
  onUpdateResume,
  onUpdateCompany,
  onRemove,
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editData, setEditData] = useState({
    id,
    jobName,
    salary,
    progress,
    title,
    skills,
    requirements,
    selectedResume,
    selectedCompany,
  });

  const progressOptions = [
    "Just Applied",
    "Interviewing - First Stage",
    "Interviewing - Final Stage",
    "Offer Received",
    "Hired",
  ];

  const educationOptions = [
    "High School Diploma",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
  ];

useEffect(() => {
  const fetchUserResumes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:80/resumes/${username}`);
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      } else {
        console.error("Failed to fetch resumes");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  fetchUserResumes(); // Initial fetch

  const interval = setInterval(fetchUserResumes, 5000); // Repeat every 5 seconds

  return () => clearInterval(interval); // Cleanup
}, [username]);

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:80/users/${username}/companies`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        console.error("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  fetchCompanies(); // Initial fetch

  const interval = setInterval(fetchCompanies, 10000); // Repeat every 10 seconds

  return () => clearInterval(interval); // Cleanup
}, [username]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = async (company) => {
    setEditData((prev) => ({ ...prev, selectedCompany: company }));

    try {
      const response = await fetch(`http://127.0.0.1:80/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedCompany: company }),
      });

      if (response.ok) {
        const data = await response.json();
        //onUpdateCompany(id, company);
      } else {
        console.error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleResumeChange = async (resumeId) => {
    setEditData((prev) => ({ ...prev, selectedResume: resumeId }));

    try {
      const response = await fetch(
        `http://127.0.0.1:80/jobs/${id}/associate_resume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume_id: resumeId }),
        }
      );

      if (!response.ok) {
        console.error("Failed to associate resume");
        return;
      }

      //onUpdateResume(id, resumeId);
    } catch (error) {
      console.error("Error associating resume:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData);
    setPopupOpen(false);
  };

  return (
    <>
      <div className={styles.card} onClick={() => setPopupOpen(true)}>
        <h2 className={styles.jobName}>{title}</h2>
        <div className={styles.details}>
          <p>
            <strong>Salary:</strong> {salary}
          </p>
          <label>
            <strong>Progress:</strong>
            <select
              name="progress"
              value={editData.progress || ""}
              onChange={(e) => {
                e.stopPropagation();
                handleChange(e);
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.progressDropdown}
            >
              {progressOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <p>
            <strong>Skills:</strong> {skills}
          </p>
          <label>
            <strong>Education Required:</strong>
            <select
              name="requirements"
              value={editData.requirements || ""}
              onChange={(e) => {
                e.stopPropagation();
                handleChange(e);
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.educationDropdown}
            >
              {educationOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <strong>Resume Used:</strong>
            <select
              name="selectedResume"
              value={editData.selectedResume ? editData.selectedResume.id : ""}
              onChange={(e) => {
                e.stopPropagation();
                handleResumeChange(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.resumeDropdown}
            >
              <option key="-1" value="-1">
                None
              </option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.pdf_file.split("/").pop()}
                </option>
              ))}
            </select>
          </label>
          <label>
            <strong>Company:</strong>
            <select
              name="selectedCompany"
              value={editData.selectedCompany || ""}
              onChange={(e) => {
                e.stopPropagation();
                handleCompanyChange(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.companyDropdown}
            >
              <option key="-1" value="">
                None
              </option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_name}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={styles.removeButton}
          >
            Remove
          </button>
        </div>
      </div>

      <Popup
        companyData={editData}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}