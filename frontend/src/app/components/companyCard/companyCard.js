import styles from "./companyCard.module.css";


export default function companyCard({
  jobName,
  salary,
  progress,
  title,
  skills,
  requirements,
}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.jobName}>{jobName}</h2>
      <div className={styles.details}>
        <p><strong>Salary:</strong> {salary}</p>
        <p><strong>Progress:</strong> {progress}</p>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Skills:</strong> {skills}</p>
        <p><strong>Requirements:</strong> {requirements}</p>
      </div>
    </div>
  );
}
