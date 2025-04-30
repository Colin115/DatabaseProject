import Image from "next/image";
import styles from "./page.module.css";
import Header from "../../components/header";
import Companies from "../../components//companies/companies";
import Resumes from "../../components/resumes/resumes";
    
export default async function Profile({ params }) {
  const { username } = await params;
  return (
    <div className={styles.page}>
      <Header />
      {username}'s Profile
      <Companies />
      <Resumes />
    </div>
  );
}
