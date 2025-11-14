// src/pages/Student/StudentDashboard/StudentDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FiBarChart2,
  FiCalendar,
  FiLogOut,
  FiTrendingUp,
} from "react-icons/fi";

import styles from "./StudentDashboard.module.scss";
import { checkpoint } from "../../../utils/imageGet";
import { logout } from "../../../App/Api/Auth/authSlice";
import { fetchMeThunk } from "../../../App/Api/Auth/getMeSlice";

const StudentDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.getMe);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <img
          src={user?.avatar || "https://i.pravatar.cc/100"}
          alt={user?.firstName || "student"}
          className={styles.avatar}
        />

        <div className={styles.info}>
          <p className={styles.welcome}>{t("studentDashboard.welcome")}</p>
          <h2 className={styles.name}>
            {loading
              ? t("studentDashboard.loading")
              : user
              ? `${(user.firstName || "").trim()} ${(
                  user.lastName || ""
                ).trim()}`.trim() || t("studentDashboard.student")
              : t("studentDashboard.user")}
          </h2>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut size={22} />
        </button>
      </div>

      {/* 🔹 Main */}
      <div className={styles.mainBox}>
        {/* Topshiriqlar */}
        <div
          className={styles.taskCard}
          onClick={() => navigate("/home/student/homework")}
        >
          <div className={styles.taskLeft}>
            <img src={checkpoint} className={styles.taskIcon} alt="checkpoint" />
            <div>
              <p className={styles.taskTitle}>
                {t("studentDashboard.tasks")}{" "}
                <span className={styles.badge}>2</span>
              </p>
              <p className={styles.taskSubtitle}>
                {t("studentDashboard.deadlines")}
              </p>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </div>

        {/* 🔹 Quick actions */}
        <div className={styles.quickLinks}>
          <div className={styles.quickItem}>
            <FiCalendar size={25} className={styles.quickIcon} />
            <span className={styles.quickLabel}>
              {t("studentDashboard.attendance")}
            </span>
          </div>
          <div className={styles.quickItem}>
            <FiTrendingUp size={25} className={styles.quickIcon} />
            <span className={styles.quickLabel}>
              {t("studentDashboard.progress")}
            </span>
          </div>
          <div className={styles.quickItem}>
            <FiBarChart2 size={25} className={styles.quickIcon} />
            <span className={styles.quickLabel}>
              {t("studentDashboard.rating")}
            </span>
          </div>
        </div>

        {/* 🔹 Schedule */}
        <div className={styles.schedule}>
          <div className={styles.scheduleHeader}>
            <h3>{t("studentDashboard.schedule")}</h3>
            <span>{new Date().toLocaleDateString("uz-UZ")}</span>
          </div>

          <div className={styles.lessonGrid}>
            {[
              {
                subject: "Matematika",
                teacher: "Nodira Boymatova",
                start: "08:00",
                end: "08:45",
              },
              {
                subject: "Ona-tili",
                teacher: "Nodira Boymatova",
                start: "08:50",
                end: "09:35",
              },
              {
                subject: "Biologiya",
                teacher: "Nodira Boymatova",
                start: "09:40",
                end: "10:25",
              },
              {
                subject: "Informatika",
                teacher: "Nodira Boymatova",
                start: "10:40",
                end: "11:25",
              },
            ].map((lesson, idx) => (
              <div key={idx} className={styles.lessonItem}>
                <div>
                  <p className={styles.subject}>{lesson.subject}</p>
                  <p className={styles.teacher}>{lesson.teacher}</p>
                </div>
                <div className={styles.timeBox}>
                  <span className={styles.start}>{lesson.start}</span>
                  <span className={styles.end}>{lesson.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className={styles.errorText}>⚠️ {error}</p>}
      </div>
    </div>
  );
};

export default StudentDashboard;