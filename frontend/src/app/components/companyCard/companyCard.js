"use client";
import { useState } from "react";
import styles from "./companyCard.module.css";
import Popup from "../companyPopup/popup";

export default function CompanyCard({
  id,
  jobName,
  salary,
  progress,
  title,
  skills,
  requirements,
  onUpdate
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState({
    id,
    jobName,
    salary,
    progress,
    title,
    skills,
    requirements,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData); // pass data up
    setPopupOpen(false);
  };

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
