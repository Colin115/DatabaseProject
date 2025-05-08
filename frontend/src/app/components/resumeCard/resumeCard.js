"use client";

import React, { useState } from "react";
import styles from "./resumeCard.module.css";
import Popup from "../resumePopup/popup";

const ResumeCard = ({ fileName, uploadDate, fileSize, onRemove, onUpdate, resumeId }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState({ fileName });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:80/resumes/update/${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        console.log("Resume name updated successfully");
        onUpdate(editData);
      } else {
        console.error("Failed to update resume:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating resume:", error);
    }

    setPopupOpen(false);
  };

  return (
    <>
      <div className={styles.card} onClick={() => setPopupOpen(true)}>
        <p>
          <strong>File Name:</strong>{" "}
          <span className={styles.editableFileName}>{fileName}</span>
        </p>
        <p><strong>Upload Date:</strong> {uploadDate}</p>
        <p><strong>File Size:</strong> {fileSize}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={styles.deleteBtn}
        >
          Remove
        </button>
      </div>

      <Popup
        resumeData={editData}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default ResumeCard;
