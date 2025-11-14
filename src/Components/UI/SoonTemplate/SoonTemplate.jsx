import React from "react";
import styles from "./SoonTemplate.module.scss";

const SoonTemplate = ({ title = "Tez orada", subtitle = "Bu yerda chiroyli bo‘ladi ✨" }) => {
  const drops = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 2 + Math.random() * 3;
    const height = 15 + Math.random() * 25;

    return (
      <div
        key={i}
        className={styles.drop}
        style={{
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          height: `${height}px`,
        }}
      />
    );
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.rain}>{drops}</div>
      <div className={styles.soonBox}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
};

export default SoonTemplate;