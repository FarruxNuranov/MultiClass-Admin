import React from "react";
import styles from "./Loader.module.scss";

const Loader = ({ size = 50, color = "#262962" }) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.spinner}
        style={{
          width: size,
          height: size,
          borderTopColor: color,
        }}
      />
    </div>
  );
};

export default Loader;