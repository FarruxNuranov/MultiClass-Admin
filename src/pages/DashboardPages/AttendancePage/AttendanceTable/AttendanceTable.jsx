// src/pages/DashboardPages/AttendancePage/AttendanceTable/AttendanceTable.jsx
import React from "react";
import styles from "./AttendanceTable.module.scss";
import { useTranslation } from "react-i18next";

const AttendanceTable = ({ list, loading, error, onRowClick }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.table}>
      {/* 🔹 Заголовок */}
      <div className={`${styles.row} ${styles.head}`}>
        <span>{t("attendanceTable.class")}</span>
        <span>{t("attendanceTable.attendance")}</span>
        <span>{t("attendanceTable.present")}</span>
        <span>{t("attendanceTable.absent")}</span>
        <span>{t("attendanceTable.totalStudents")}</span>
      </div>

      {loading && <p>{t("attendanceTable.loading")}</p>}
      {error && <p className={styles.error}>❌ {t("attendanceTable.error")}</p>}

      {!loading &&
        list.map((item) => (
          <div
            key={item._id}
            className={styles.row}
            onClick={() => onRowClick(item._id)}
            style={{ cursor: "pointer" }}
          >
            {/* Sinf */}
            <span className={styles.className}>{item.class?.title}</span>

            {/* Davomat */}
            <span>
              <span
                className={`${styles.badge} ${
                  item.attendancePercentage >= 90
                    ? styles.green
                    : item.attendancePercentage >= 75
                    ? styles.yellow
                    : styles.red
                }`}
              >
                {item.attendancePercentage?.toFixed(1) || 0}%
              </span>
            </span>

            {/* Kelgan */}
            <span>{item.presentCount}</span>

            {/* Kelmagan */}
            <span>{item.absentCount}</span>

            {/* Всего */}
            <span>{item.totalStudents}</span>
          </div>
        ))}
    </div>
  );
};

export default AttendanceTable;