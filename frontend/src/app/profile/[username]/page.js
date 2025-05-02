import styles from "./page.module.css";
import Header from "../../components/header";
import Companies from "../../components/companies/companies";
import Resumes from "../../components/resumes/resumes";


export default async function Profile({ params }) {
  const { username } = params;

  // Placeholder for future user data fetch
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    title: "Software Engineer",
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.profileHeader}>
        <h2>{username}'s Profile</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Title:</strong> {userData.title}</p>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.column}>
          <h3>Companies</h3>
          <Companies />
        </div>
        <div className={styles.column}>
          <h3>Resumes</h3>
          <Resumes />
        </div>
      </div>
    </div>
  );
}
