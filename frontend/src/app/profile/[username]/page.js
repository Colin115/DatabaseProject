import Image from "next/image";
import styles from "./page.module.css";
import Header from "./../../componenets/header";

export default function Profile({ params }) {
  const { username } = params;
  return (
    <div className={styles.page}>
      <Header />
      {username}'s Profile
    </div>
  );
}
