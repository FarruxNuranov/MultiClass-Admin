// src/pages/DashboardPages/StudentsPage/SingleStudentPage/StudentInfo/StudentInfo.jsx
import React from "react";
import styles from "./StudentInfo.module.scss";
import { FiDownload, FiUser } from "react-icons/fi";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
const StudentInfo = ({ student, onEditClick }) => {
  const { t } = useTranslation();
  
  const navigate = useNavigate();

  if (!student) return <div>{t("studentInfo.notFound")}</div>;
  return (
    <div className={styles.page}>
      {/* 🔹 Верхний градиент */}
      <div className={styles.headerBg}></div>

      {/* 🔹 Хэдер */}
      <div className={styles.header}>
        <div className={styles.left}>
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.firstName}
              className={styles.avatar}
            />
          ) : (
            <FiUser className={styles.avatarIcon} />
          )}
          <div>
            <div className={styles.breadcrumbs}>
              <Breadcrumbs />
            </div>
            <h1 className={styles.name}>
              {student.firstName} {student.lastName}
            </h1>
            <p className={styles.email}>{student.email}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn}  onClick={() => navigate(`/home/students/${student._id}/edit`)}>
            {t("studentInfo.edit")}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload /> {t("studentInfo.export")}
          </button>
        </div>
      </div>

      {/* 🔹 Информация */}
      <div className={styles.infoSection}>
        {/* Левая колонка */}
        <div className={styles.leftInfo}>
          <p className={styles.label}>{t("studentInfo.address")}</p>
          <p className={styles.value}>{t("studentInfo.defaultAddress")}</p>

          <p className={styles.label}>{t("studentInfo.telegram")}</p>
          <a
            href={`https://t.me/${student.telegram?.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {student.telegram || "—"}
          </a>

          <p className={styles.label}>{t("studentInfo.phone")}</p>
          <a href={`tel:${student.phone}`} className={styles.link}>
            {student.phone || "—"}
          </a>
        </div>

        {/* Правая колонка */}
        <div className={styles.rightInfo}>
          <h3>{t("studentInfo.summaryTitle")}</h3>
          <p>{student.bio || t("studentInfo.summaryEmpty")}</p>
          <a href="#" className={styles.moreLink}>
            {t("studentInfo.readMore")}
          </a>
        </div>
      </div>

      {/* 🔹 Оценки */}
      <div className={styles.infoSection}>
        <div className={styles.leftInfo}>
          <h3>{t("studentInfo.subjectsTitle")}</h3>
        </div>
        <div className={styles.rightInfo}>
          <table className={styles.subjectsTable}>
            <thead>
              <tr>
                <th>{t("studentInfo.subject")}</th>
                <th>{t("studentInfo.grades")}</th>
                <th>{t("studentInfo.averageGrade")}</th>
              </tr>
            </thead>
            <tbody>
              {student.myMarks?.length > 0 ? (
                student.myMarks.map((subj, idx) => (
                  <tr key={idx}>
                    <td>{subj.science}</td>
                    <td>
                      {subj.marks.map((g, i) => (
                        <span
                          key={i}
                          className={`${styles.grade} ${
                            g >= 5
                              ? styles.good
                              : g == 4
                              ? styles.medium
                              : styles.bad
                          }`}
                        >
                          {g}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span
                        className={`${styles.grade} ${
                          subj.avgMark >= 5
                            ? styles.good
                            : subj.avgMark >= 4
                            ? styles.medium
                            : styles.bad
                        }`}
                      >
                        {subj.avgMark}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    <div className={styles.noMarks}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/7476/7476936.png"
                        alt="no data"
                      />
                      <p>{t("studentInfo.noGradesTitle")}</p>
                      <span>{t("studentInfo.noGradesDesc")}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Документы */}
      <div className={styles.docsSection}>
        <div className={styles.docsLeft}>
          <h3>{t("studentInfo.documents")}</h3>
        </div>
        <div className={styles.docsRight}>
          <div className={styles.docsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.docCard}>
                <img
                  src={`https://picsum.photos/400/250?random=${i + 50}`}
                  alt={`Doc ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
