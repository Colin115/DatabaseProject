"use client";

import React, { useState, useRef } from "react";
import ResumeCard from "../resumeCard/resumeCard";
import styles from "./resumes.module.css";

const Resumes = () => {
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const newResume = {
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString(),
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      };
      setUploadedResumes((prevResumes) => [...prevResumes, newResume]);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <center>
        <button onClick={openFileExplorer} className={styles.buttonResume}>
          Add Resume
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </center>
      <div>
        {uploadedResumes.map((resume, index) => (
          <ResumeCard
            key={index}
            fileName={resume.fileName}
            uploadDate={resume.uploadDate}
            fileSize={resume.fileSize}
          />
        ))}
      </div>
    </div>
  );
};

export default Resumes;