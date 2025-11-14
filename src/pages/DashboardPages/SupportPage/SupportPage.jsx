import React from "react";
import styles from "./SupportPage.module.scss";
import SoonTemplate from "../../../Components/UI/SoonTemplate/SoonTemplate";

const SupportPage = () => {
  return (
    <div className={styles.page}>
       <SoonTemplate 
      title="Support"
      subtitle="Tez orada bu yerda juda chiroyli bo‘ladi ✨"
    />
    </div>
  );
};

export default SupportPage;