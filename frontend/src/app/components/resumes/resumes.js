"use client";

import React, { useState, useEffect, useRef } from "react";
import ResumeCard from "../resumeCard/resumeCard";
import styles from "./resumes.module.css";

const Resumes = ({ username }) => {
  const [uploadedResumes, setUploadedResumes] = useState([]);
  const fileInputRef = useRef(null);

  const uploadNewResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://127.0.0.1:80/add_resumes/${username}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Resume uploaded successfully");
        fetchResumes(); 
      } else {
        console.error("Failed to upload resume:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:80/resumes/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUploadedResumes(data);
      } else {
        console.error("Failed to fetch resumes");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchResumes();
    }
  }, [username]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      uploadNewResume(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveResume = async (indexToRemove, resumeId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:80/resumes/${username}/${resumeId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUploadedResumes((prevResumes) =>
          prevResumes.filter((_, index) => index !== indexToRemove)
        );
        console.log("Resume deleted successfully");
      } else {
        console.error("Failed to delete resume:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
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
            fileName={resume.pdf_file || "Unknown File"}
            fileUrl={`http://127.0.0.1:80/uploads/${resume.pdf_file}`} 
            uploadDate={resume.uploadDate || "N/A"}
            fileSize={resume.fileSize || "N/A"}
            onRemove={() => handleRemoveResume(index, resume.id)}
            resumeId={resume.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Resumes;