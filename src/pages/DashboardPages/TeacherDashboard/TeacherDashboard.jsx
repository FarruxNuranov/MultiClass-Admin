// src/pages/TeacherDashboard/TeacherDashboard.jsx
import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import styles from "./TeacherDashboard.module.scss";
import { useTranslation } from "react-i18next";

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("30days");
  const [activeTab, setActiveTab] = useState("schedule");

  const filters = ["12months", "30days", "7days", "24hours"];

  const classes = [
    {
      class: "9A",
      attendance: "72%",
      students: 28,
      teacher: "Dilshod Xolmatov",
      avatar: "https://i.pravatar.cc/40?img=11",
    },
    {
      class: "9B",
      attendance: "80%",
      students: 31,
      teacher: "Madina Karimova",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
  ];

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("teachersDashboard.header.title")}</h1>
      </div>

      {/* 🔹 Filters + Date */}
      <div className={styles.Tabs}>
        <div className={styles.left}>
          <div className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${
                  activeFilter === f ? styles.active : ""
                }`}
                onClick={() => setActiveFilter(f)}
              >
                {t(`teachersDashboard.filters.${f}`)}
              </button>
            ))}
          </div>
        </div>

        <button className={styles.dateBtn}>
          <FiCalendar />
          <span>{t("teachersDashboard.header.dateRange")}</span>
        </button>
      </div>

      <div className={styles.splitBox}>
        {/* 🔹 Left side */}
        <div className={styles.leftBox}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeaderTop}>
              <h3 className={styles.cardTitle}>
                {t("teachersDashboard.leftTable.title")}
              </h3>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("teachersDashboard.leftTable.columns.class")}</th>
                    <th>{t("teachersDashboard.leftTable.columns.attendance")}</th>
                    <th>{t("teachersDashboard.leftTable.columns.students")}</th>
                    <th>{t("teachersDashboard.leftTable.columns.teacher")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.class}</td>
                      <td>
                        <span className={styles.badge}>{row.attendance}</span>
                      </td>
                      <td>{row.students}</td>
                      <td className={styles.teacher}>
                        <img src={row.avatar} alt={row.teacher} />
                        <span>{row.teacher}</span>
                      </td>
                      <td>
                        <button className={styles.moreBtn}>⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 🔹 Right side */}
        <div className={styles.rightBox}>
          <div className={styles.rightCard}>
            <div className={styles.rightHeader}>
              <h3 className={styles.rightTitle}>
                {t("teachersDashboard.rightPanel.title")}
              </h3>
              <p className={styles.rightSubtitle}>
                {t("teachersDashboard.rightPanel.subtitle")}
              </p>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "schedule" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("schedule")}
              >
                {t("teachersDashboard.rightPanel.tabs.schedule")}
              </button>
              <button
                className={`${styles.tabBtn} ${
                  activeTab === "tasks" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("tasks")}
              >
                {t("teachersDashboard.rightPanel.tabs.tasks")}
              </button>
            </div>

            {/* Content */}
            <div className={styles.tabContent}>
              {activeTab === "schedule" && (
                <div className={styles.scheduleList}>
                  {[1, 2].map((i) => (
                    <div key={i} className={styles.scheduleItem}>
                      <p>
                        <strong>9B-sinf</strong> 8:00 – 8:45
                      </p>
                      <span>
                        {t("teachersDashboard.rightPanel.sampleSchedule")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "tasks" && (
                <div className={styles.taskList}>
                  {[1, 2].map((i) => (
                    <div key={i} className={styles.taskItem}>
                      <p>
                        <strong>Matematika</strong> –{" "}
                        {t("teachersDashboard.rightPanel.sampleTask")}
                      </p>
                      <span>
                        9B-sinf | 12{" "}
                        {t("teachersDashboard.rightPanel.taskCount")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;