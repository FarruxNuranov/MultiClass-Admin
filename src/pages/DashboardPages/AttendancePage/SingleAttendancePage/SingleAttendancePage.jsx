// src/pages/DashboardPages/AttendancePage/SingleAttendancePage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./SingleAttendancePage.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import { FiDownload, FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceByClass } from "../../../../App/Api/Attendance/attendanceSlice";
import { useTranslation } from "react-i18next";

const SingleAttendancePage = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // classId
  const dispatch = useDispatch();

  const { classList, loading, error } = useSelector((s) => s.attendance);

  // 📌 Загружаем список посещаемости по классу
  useEffect(() => {
    if (id) {
      dispatch(fetchAttendanceByClass(id));
    }
  }, [dispatch, id]);

  // 📊 Статистика
  const totalPresent = classList.filter((st) => st.status === "present").length;
  const totalAbsent = classList.filter((st) => st.status === "absent").length;
  const percentage =
    classList.length > 0
      ? ((totalPresent / classList.length) * 100).toFixed(1)
      : 0;

  const breadcrumbs = [
    { label: t("singleAttendance.breadcrumbsMain"), to: "/dashboard/attendance" },
    { label: t("singleAttendance.class", { className: id }) },
  ];

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Статистика */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <p className={styles.label}>{t("singleAttendance.attendance")}</p>
          <h2 className={styles.value}>{percentage}%</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>{t("singleAttendance.present")}</p>
          <h2 className={styles.value}>{totalPresent}</h2>
        </div>
        <div className={styles.card}>
          <p className={styles.label}>{t("singleAttendance.absent")}</p>
          <h2 className={styles.value}>{totalAbsent}</h2>
        </div>
      </div>

      {/* 🔹 Заголовок + Фильтры */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("singleAttendance.class", { className: id })}</h2>
        <div className={styles.right}>
          <button className={styles.calendarBtn}>
            <FiCalendar /> {t("singleAttendance.today")}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload /> {t("singleAttendance.export")}
          </button>
        </div>
      </div>

      {/* 🔹 Таблица */}
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <span>{t("singleAttendance.studentName")}</span>
          <span>{t("singleAttendance.attendanceStatus")}</span>
          <span>{t("singleAttendance.checkIn")}</span>
          <span>{t("singleAttendance.checkOut")}</span>
        </div>

        {loading && <p>{t("singleAttendance.loading")}</p>}
        {error && <p className={styles.error}>❌ {error}</p>}
        {!loading && classList.length === 0 && (
          <p>{t("singleAttendance.notFound")}</p>
        )}

        {!loading &&
          classList.map((item) => (
            <div key={item._id} className={styles.row}>
              {/* 🔹 Info */}
              <div className={styles.user}>
                <img
                  src={`https://i.pravatar.cc/40?u=${
                    item.student?._id || item._id
                  }`}
                  alt={item.student ? item.student.firstName : "No Name"}
                />
                <div>
                  <p className={styles.name}>
                    {item.student
                      ? `${item.student.firstName} ${item.student.lastName}`
                      : "—"}
                  </p>
                </div>
              </div>

              {/* 🔹 Status */}
              <span>
                <span
                  className={`${styles.badge} ${
                    item.status === "present"
                      ? styles.green
                      : item.status === "late" || item.status === "early_departure"
                      ? styles.yellow
                      : styles.red
                  }`}
                >
                  {item.status === "present"
                    ? t("singleAttendance.statusPresent")
                    : item.status === "late"
                    ? t("singleAttendance.statusLate")
                    : item.status === "early_departure"
                    ? t("singleAttendance.statusEarly")
                    : t("singleAttendance.statusAbsent")}
                </span>
              </span>

              {/* 🔹 Время прихода / ухода */}
              <span>
                {item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
              <span>
                {item.checkOut
                  ? new Date(item.checkOut).toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SingleAttendancePage;