// src/Layout/Dashboard/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

import styles from "./DashboardLayout.module.scss";
import Sidebar from "../../Components/Sidebar/Sidebar";

const DashboardLayout = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const showFullscreen = location.pathname === "/home/dashboard";

  // 🔹 Переключатель полноэкранного режима
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Левый блок — Sidebar */}
      <aside className={styles.sidebarWrapper}>
        <Sidebar />
      </aside>

      {/* Правый блок — Navbar + контент */}
      <div className={styles.mainContent}>
        {/* 🔹 Кнопка "Full Screen" */}
        {showFullscreen && (
          <div className={styles.fullscreenBtn}>
            <Tooltip title={isFullscreen ? "Chiqish" : "Butun ekran"}>
              <Button
                type="text"
                shape="square"
                icon={
                  isFullscreen ? (
                    <FullscreenExitOutlined style={{ fontSize: 18 }} />
                  ) : (
                    <FullscreenOutlined style={{ fontSize: 18 }} />
                  )
                }
                onClick={toggleFullscreen}
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </Tooltip>
          </div>
        )}

        {/* Основной контент */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
