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

  return (
    <div className={styles.container} onClick={() => setPopupOpen(false)}>
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        <form onSubmit={onSubmit}>
            <input
            name="jobName"
            placeholder="Job Name"
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
            name="progress"
            placeholder="Progress"
            value={companyData.progress}
            onChange={onChange}
          />
          <input
            name="title"
            placeholder="Job Title"
            value={companyData.title}
            onChange={onChange}
          />
          <input
            name="skills"
            placeholder="Skills"
            value={companyData.skills}
            onChange={onChange}
          />
          <input
            name="requirements"
            placeholder="Requirements"
            value={companyData.requirements}
            onChange={onChange}
          />
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
