"use client";
import React, { useState, useEffect } from "react";
import styles from "./companyCard.module.css";
import Popup from "../addCompaniesPopUp/popup";

const AddCompanyCard = ({ companyData, onUpdate, onRemove }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(companyData);

  const handleClick = () => {
    setEditData(companyData);
    setPopupOpen(true);
  };

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
    <div className={styles.card} onClick={handleClick}>
      <h2>{companyData.name}</h2>
      <p>
        <strong>Location:</strong> {companyData.location}
      </p>
      <p>
        <strong>Rating:</strong> {companyData.rating}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={styles.deleteBtn}
      >Remove</button>
      <Popup
        companyData={editData}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddCompanyCard;
