// src/pages/DashboardPages/SchedulePage/SchedulePage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiRefreshCw } from "react-icons/fi";
import styles from "./SchedulePage.module.scss";
import { fetchClasses } from "../../../App/Api/Classes/classesSlice";
import { useTranslation } from "react-i18next";

const SchedulePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: classes = [], loading, error } = useSelector(
    (state) => state.classes
  );

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleCardClick = (classId) => {
    if (!classId) return console.error("❌ Class ID undefined!");
    navigate(`/home/schedule/${classId}`);
  };

  const grouped = classes.reduce((acc, item) => {
    if (!acc[item.grade]) acc[item.grade] = [];
    acc[item.grade].push(item);
    return acc;
  }, {});

  const sortedGrades = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("schedulePage.title")}</h1>
        <button
          className={styles.refreshBtn}
          onClick={() => navigate("/home/schedule/edit")}
        >
          <FiRefreshCw /> {t("schedulePage.rebuild")}
        </button>
      </div>

      {loading && <p>⏳ {t("schedulePage.loading")}</p>}
      {error && <p className={styles.error}>❌ {t("schedulePage.error")}</p>}

      {/* 🔹 Список классов */}
      {!loading &&
        sortedGrades.map((grade) => (
          <div key={grade} className={styles.gradeBlock}>
            <h2 className={styles.gradeTitle}>
              {t("schedulePage.classesTitle", { grade })}
            </h2>
            <div className={styles.cards}>
              {grouped[grade].map((cls) => (
                <div
                  key={cls._id}
                  className={styles.card}
                  onClick={() => handleCardClick(cls._id)}
                >
                  <p className={styles.teacher}>
                    {cls.teacher
                      ? `${cls.teacher.firstName} ${cls.teacher.lastName}`
                      : t("schedulePage.noTeacher")}
                  </p>
                  <h3 className={styles.className}>
                    {cls.title} ({cls.grade}-sinf)
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SchedulePage;