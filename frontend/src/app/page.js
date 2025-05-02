import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header"

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <div className = {styles.submain}>
        <h1 className = {styles.title}>Nest</h1>
        <span className = {styles.subtitle}><center>By A.R.C.</center></span>
        <div className = {styles.button}>
          <center>
            <button className={styles.button1}><a href = "/logIn">Login</a></button> 
            <button className={styles.button2}><a href = "/signUp">Sign Up</a></button>
          </center>
          
        </div>

        <h2 className = {styles.about}>About Us</h2>
        <p className = {styles.aboutText}>Nest is an application dedicated to helping you with your job search! Ever need a place to store information? Look no further. With our free and easy to use application, you can store your job search details with us and will store it securely and efficiently with our added database components. We thank you for choosing Nest!</p>

      </div>
    </div>
  );
}
