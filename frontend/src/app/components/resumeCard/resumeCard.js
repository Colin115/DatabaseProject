"use client";

import React, { useState } from "react";
import styles from "./resumeCard.module.css";
import Popup from "../resumePopup/popup";

const ResumeCard = ({ fileName, uploadDate, fileSize, onRemove, onUpdate }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState({ fileName });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData);
    setPopupOpen(false);
  };

  return (
    <>
      <div
        className={styles.card}
        onClick={() => setPopupOpen(true)} 
      >
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