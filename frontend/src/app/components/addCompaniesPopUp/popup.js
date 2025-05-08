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
            name="name"
            placeholder="Compnay Name"
            value={companyData.name}
            onChange={onChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={companyData.location}
            onChange={onChange}
          />
          <input
            name="rating"
            placeholder="Rating"
            value={companyData.rating}
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
