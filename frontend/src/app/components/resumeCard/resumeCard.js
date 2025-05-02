import React from "react";
import styles from "./resumeCard.module.css";

const ResumeCard = ({ fileName, uploadDate, fileSize }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.fileName}>{fileName}</h2>
      <div className={styles.details}>
        <p><strong>Upload Date:</strong> {uploadDate}</p>
        <p><strong>File Size:</strong> {fileSize}</p>
      </div>
    </div>
  );
};

export default ResumeCard;