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
  onUpdate,
  onRemove,
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [editData, setEditData] = useState({
    id,
    jobName,
    salary,
    progress,
    title,
    skills,
    requirements,
    selectedResume: "", 
  });


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

    fetchUserResumes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData); 
    setPopupOpen(false);
  };

  console.log(resumes)

  return (
    <>
      <div className={styles.card} onClick={() => setPopupOpen(true)}>
        <h2 className={styles.jobName}>{jobName}</h2>
        <div className={styles.details}>
          <p><strong>Salary:</strong> {salary}</p>
          <p><strong>Progress:</strong> {progress}</p>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Skills:</strong> {skills}</p>
          <p><strong>Requirements:</strong> {requirements}</p>
          <label>
            <strong>Resume Used:</strong>
            <select
              name="selectedResume"
              value={editData.selectedResume}
              onChange={(e) => {
                e.stopPropagation(); 
                handleChange(e);
              }}
              onClick={(e) => e.stopPropagation()} 
              className={styles.resumeDropdown}
            >
              <option value="">None</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.pdf_file}>
                  {resume.pdf_file}
                </option>
              ))}
            </select>
          </label>
        </div>
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