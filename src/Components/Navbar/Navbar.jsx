// src/Components/Navbar/Navbar.jsx
import React from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <h2>Dars jadvali</h2>
      <button className={styles.btn}>↻ Qayta tuzish</button>
    </header>
  );
};

export default Navbar;