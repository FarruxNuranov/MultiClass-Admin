// src/pages/SettingsPage/LessonPlanPage/LessonGradesPage/LessonGradesPage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiCalendar } from "react-icons/fi";

import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import styles from "./LessonGradesPage.module.scss";

// redux
import {
  fetchHomeworkByTopic,
  updateHomeworkGrade,
} from "../../../../App/Api/homework/homeworkSlice";

const LessonGradesPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const dispatch = useDispatch();

  const {
    items: homeworks = [],
    loading,
    error,
  } = useSelector((state) => state.homework);

  useEffect(() => {
    if (topicId) dispatch(fetchHomeworkByTopic(topicId));
  }, [dispatch, topicId]);

  const handleGradeChange = (homeworkId, mark) => {
    if (!mark) return;
    dispatch(updateHomeworkGrade({ id: homeworkId, mark }));
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: t("lessonGradesPage.breadcrumbs.plan"), to: "/home/lesson-plan" },
          { label: t("lessonGradesPage.breadcrumbs.grades") },
        ]}
      />

      <div className={styles.header}>
        <h2 className={styles.title}>{t("lessonGradesPage.title")}</h2>
        <button className={styles.dateBtn}>
          <FiCalendar size={16} style={{ marginRight: "6px" }} />
          {new Date().toLocaleDateString("uz-UZ")}
        </button>
      </div>

      {/* error / loading */}
      {loading && <p>{t("lessonGradesPage.loading")}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <span>{t("lessonGradesPage.table.assignment")}</span>
          <span>{t("lessonGradesPage.table.message")}</span>
          <span>{t("lessonGradesPage.table.files")}</span>
          <span>{t("lessonGradesPage.table.grade")}</span>
        </div>

        {homeworks.length === 0 && !loading ? (
          <p className={styles.empty}>{t("lessonGradesPage.noHomeworks")}</p>
        ) : (
          homeworks.map((hw) => (
            <div key={hw._id} className={styles.row}>
              <span>{hw.topic?.title || "—"}</span>
              <span>{hw.message || "—"}</span>
              <span>
                {hw.files && hw.files.length > 0
                  ? hw.files.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: "6px" }}
                      >
                        {f.name}
                      </a>
                    ))
                  : "—"}
              </span>

              <select
                value={hw.mark || ""}
                onChange={(e) => handleGradeChange(hw._id, e.target.value)}
              >
                <option value="">{t("lessonGradesPage.table.noGrade")}</option>
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonGradesPage;