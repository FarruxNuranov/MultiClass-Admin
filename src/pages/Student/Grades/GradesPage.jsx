// src/pages/Student/GradesPage/GradesPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./GradesPage.module.scss";

const GradesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔹 Временные данные (пример)
  const subjects = [
    { name: "Matematika", grades: [5, 5, 3, 5, 3, 5, 5, 4, 5, 3, 5] },
    { name: "Fizika", grades: [5, 3, 4, 5, 5, 4, 3, 4] },
    { name: "Kimyo", grades: [4, 4, 5, 4, 5, 3, 4, 5] },
    { name: "Biologiya", grades: [3, 5, 4, 5, 4, 4, 3, 5] },
    { name: "Tarix", grades: [4, 3, 4, 3, 4, 5, 4, 3] },
    { name: "Geografiya", grades: [5, 5, 4, 5] },
    { name: "Adabiyot", grades: [4, 4, 5, 4, 5, 5] },
  ];

  const getAverage = (grades) => {
    const sum = grades.reduce((a, b) => a + b, 0);
    return (sum / grades.length).toFixed(1);
  };

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <FiChevronLeft className={styles.backIcon} onClick={() => navigate(-1)} />
        <h2>{t("gradesPage.title")}</h2>
      </div>

      {/* 🔹 Subjects list */}
      <div className={styles.subjectList}>
        {subjects.map((subject, idx) => (
          <div key={idx} className={styles.subjectCard}>
            <div className={styles.subjectHeader}>
              <h3>{subject.name}</h3>
              <div className={styles.averageBox}>
                <FiTrendingUp />
                <span>
                  {t("gradesPage.average")}: {getAverage(subject.grades)}
                </span>
              </div>
            </div>

            <div className={styles.gradesRow}>
              {subject.grades.map((grade, i) => (
                <span
                  key={i}
                  className={`${styles.grade} ${
                    grade >= 5
                      ? styles.green
                      : grade === 4
                      ? styles.yellow
                      : styles.red
                  }`}
                >
                  {grade}
                </span>
              ))}
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <p className={styles.empty}>{t("gradesPage.noSubjects")}</p>
        )}
      </div>
    </div>
  );
};

export default GradesPage;