import React from "react";
import styles from "./ReportsPage.module.scss";
import SoonTemplate from "../../../Components/UI/SoonTemplate/SoonTemplate";

const ReportsPage = () => {
  return (
    <div className={styles.page}>
       <SoonTemplate 
      title="Reports"
      subtitle="Tez orada bu yerda juda chiroyli bo‘ladi ✨"
    />
    </div>
  );
};

export default ReportsPage;