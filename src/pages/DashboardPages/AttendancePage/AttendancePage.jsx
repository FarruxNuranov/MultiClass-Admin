// src/pages/DashboardPages/AttendancePage/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AttendancePage.module.scss";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../../../App/Api/Attendance/attendanceSlice";
import AttendanceTable from "./AttendanceTable/AttendanceTable";
import { useTranslation } from "react-i18next";

const AttendancePage = () => {
  const { t } = useTranslation();
  const breadcrumbs = [{ label: t("attendancePage.breadcrumbsMain") }];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shift, setShift] = useState("present");
  const [classFilter, setClassFilter] = useState("");
  const [date, setDate] = useState("");

  const { list, loading, error } = useSelector((s) => s.attendance);

  // 🔹 Загрузка данных
  useEffect(() => {
    dispatch(fetchAttendance({ class: classFilter, date, status: shift }));
  }, [dispatch, classFilter, date, shift]);

  const handleRowClick = (id) => navigate(`/home/attendance/${id}`);

  // 📅 Форматированная дата
  const formattedDate =
    date ||
    new Date().toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // 📊 Статистика
  const averageAttendance =
    list.length > 0
      ? (
          list.reduce((acc, c) => acc + (c.attendancePercentage || 0), 0) /
          list.length
        ).toFixed(1) + "%"
      : "—";

  const totalPresent = list.reduce((acc, c) => acc + (c.presentCount || 0), 0);
  const totalAbsent = list.reduce((acc, c) => acc + (c.absentCount || 0), 0);

  return (
    <div className={styles.page}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Статистика */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <p className={styles.label}>{t("attendancePage.averageAttendance")}</p>
          <h2 className={styles.value}>{averageAttendance}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>{t("attendancePage.studentsPresent")}</p>
          <h2 className={styles.value}>{totalPresent}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>{t("attendancePage.studentsAbsent")}</p>
          <h2 className={styles.value}>{totalAbsent}</h2>
        </div>
      </div>

      {/* 🔹 Фильтры */}
      <div className={styles.filters}>
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className={styles.select}
        >
          <option value="present">{t("attendancePage.present")}</option>
          <option value="absent">{t("attendancePage.absent")}</option>
        </select>

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">{t("attendancePage.class")}</option>
          <option value="11A">11A</option>
          <option value="10A">10A</option>
          <option value="9A">9A</option>
        </select>

        <div className={styles.right}>
          <button className={styles.calendarBtn}>
            <FiCalendar /> {formattedDate}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload /> {t("attendancePage.export")}
          </button>
        </div>
      </div>

      {/* 🔹 Таблица */}
      <AttendanceTable
        list={list}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default AttendancePage;