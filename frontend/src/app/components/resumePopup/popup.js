"use client";
import styles from "./popup.module.css";

const Popup = ({ resumeData, popupOpen, setPopupOpen, onChange, onSubmit }) => {
  if (!popupOpen) return null;

  return (
    <div className={styles.container} onClick={() => setPopupOpen(false)}>
      <div
        className={styles.popupContent}
        onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
      >
        <form onSubmit={onSubmit}>
          <label>
            File Name:
            <input
              name="fileName"
              placeholder="File Name"
              value={resumeData.fileName}
              onChange={onChange}
            />
          </label>
          <div className={styles.actions}>
            <button
              className={styles.cancelBtn}
              type="button"
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