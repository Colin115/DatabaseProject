import React from "react";
import CompanyCard from "../companyCard/companyCard";

const Companies = () => {
  return (
    <div>
      <CompanyCard
        jobName="Job 1"
        salary="$120,000.00"
        progress="50%"
        title="Frontend Developer"
        skills="React, TypeScript, CSS"
        requirements="3+ years experience"
      />
    </div>
  );
};

export default Companies;
