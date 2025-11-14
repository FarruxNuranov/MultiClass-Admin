import React from "react";
import { Outlet } from "react-router-dom";

import styles from "./StudentLayout.module.scss";
import BottomNav from "../../Components/BottomNav/BottomNav";

const StudentLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default StudentLayout;