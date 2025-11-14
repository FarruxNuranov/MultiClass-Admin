// src/pages/SettingsPage/LessonPlanPage/LessonPlanPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./LessonPlanPage.module.scss";

import {
  fetchClasses,
  fetchTeacherClasses,
} from "../../../App/Api/Classes/classesSlice";

const LessonPlanPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    items: classes = [],
    loading,
    error,
  } = useSelector((state) => state.classes);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role");

  useEffect(() => {
    if (role === "teacher") {
      dispatch(fetchTeacherClasses());
    } else {
      dispatch(fetchClasses());
    }
  }, [dispatch, role]);

  const handleClassClick = (classId) => {
    navigate(`/home/lesson-plan/${classId}`);
  };

  const grouped = classes.reduce((acc, item) => {
    if (!acc[item.grade]) acc[item.grade] = [];
    acc[item.grade].push(item);
    return acc;
  }, {});

  const sortedGrades = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className={styles.page}>
      {/* 🔹 Заголовок */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("lessonsPlanPage.title")}</h1>
        <p className={styles.subtitle}>{t("lessonsPlanPage.subtitle")}</p>
      </div>

      {/* 🔹 Состояния */}
      {loading && <p>{t("lessonsPlanPage.status.loading")}</p>}
      {error && <p className={styles.error}>{t("lessonsPlanPage.status.error", { error })}</p>}

      {!loading && classes.length === 0 && (
        <p className={styles.empty}>{t("lessonsPlanPage.status.empty")}</p>
      )}

      {/* 🔹 Контент */}
      {!loading &&
        sortedGrades.map((grade) => (
          <div key={grade} className={styles.gradeBlock}>
            <h2 className={styles.gradeTitle}>
              {t("lessonsPlanPage.gradeTitle", { grade })}
            </h2>
            <div className={styles.cards}>
              {grouped[grade].map((cls) => (
                <div
                  key={cls._id}
                  className={styles.card}
                  onClick={() => handleClassClick(cls._id)}
                >
                  <h3 className={styles.className}>
                  {cls.grade} {cls.title} 
                  </h3>
                  <p className={styles.teacher}>
                    {cls.teacher
                      ? `${cls.teacher.firstName || ""} ${cls.teacher.lastName || ""}`
                      : t("lessonsPlanPage.noTeacher")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default LessonPlanPage;