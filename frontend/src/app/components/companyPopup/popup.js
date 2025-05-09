"use client";
import styles from "./popup.module.css";

const Popup = ({
  companyData,
  popupOpen,
  setPopupOpen,
  onChange,
  onSubmit,
}) => {
  if (!popupOpen) return null;
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

  return (
    <div className={styles.container} onClick={() => setPopupOpen(false)}>
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        <form onSubmit={onSubmit}>
          <input
            name="title"
            placeholder="Job Title"
            value={companyData.jobName}
            onChange={onChange}
          />
          <input
            name="salary"
            placeholder="Salary"
            value={companyData.salary}
            onChange={onChange}
          />
          <input
            name="skills"
            placeholder="Skills"
            value={companyData.skills}
            onChange={onChange}
          />
          <label>
            <strong  className={styles.wordsss}>Progress:</strong>
            <select
              name="progress"
              value={companyData.progress || ""}
              onChange={onChange}
            >
              {progressOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <strong className={styles.wordsss}>Education Required:</strong>
            <select
              name="requirements"
              value={companyData.requirements || ""}
              onChange={onChange}
            >
              {educationOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.actions}>
            <button
              className={styles.cancelBtn}
              onClick={() => setPopupOpen(false)}
            >
              Cancel
            </button>
            <button className={styles.submitBtn} type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
