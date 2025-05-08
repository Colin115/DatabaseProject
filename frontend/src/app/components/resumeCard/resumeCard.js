"use client";

import React, { useState } from "react";
import styles from "./resumeCard.module.css";
import Popup from "../resumePopup/popup";

const ResumeCard = ({ fileName, uploadDate, fileSize, onRemove, onUpdate, resumeId, fileUrl }) => {
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
        <p><strong>File Name:</strong> {fileName}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={styles.deleteBtn}
        >
          Remove
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            window.open(fileUrl, "_blank"); 
          }}
          className={styles.openBtn}
        >
          Open File
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