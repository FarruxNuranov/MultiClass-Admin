// src/pages/SettingsPage/LessonPlanPage/SingleLessonPlanPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import styles from "./SingleLessonPlanPage.module.scss";
import { FiEdit2, FiSearch, FiStar } from "react-icons/fi";
import { fetchTopics } from "../../../../App/Api/Topics/topicsSlice";

const SingleLessonPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [activeQuarter, setActiveQuarter] = useState(1);
  const { items: topics = [], loading, error } = useSelector((s) => s.topics);

  // 🔹 Грузим темы по классу
  useEffect(() => {
    if (id) dispatch(fetchTopics({ class: id }));
  }, [id, dispatch]);
console.log(`topics`,topics);
  const breadcrumbs = [
    { label: t("lessonPlanPage.title"), to: "/home/lesson-plan" },
    { label: t("lessonPlanPage.classTitle", { id }) },
  ];

  return (
    <div className={styles.page}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Хедер */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t("lessonPlanPage.classPlanTitle", { id })}
        </h2>

        <div className={styles.quarters}>
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              className={`${styles.quarterBtn} ${
                activeQuarter === q ? styles.active : ""
              }`}
              onClick={() => setActiveQuarter(q)}
            >
              {t("lessonPlanPage.quarter", { number: q })}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Секция с темами */}
      <div className={styles.tableWrapper}>
        {/* Header */}
        <div className={styles.tableHeader}>
          <div className={styles.left}>
            <h3 className={styles.tableTitle}>
              {t("lessonPlanPage.topicList")}
            </h3>
            <span className={styles.badge}>
              {topics.length} {t("lessonPlanPage.hours")}
            </span>
          </div>

          <div className={styles.right}>
            <div className={styles.searchBox}>
              <FiSearch size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("lessonPlanPage.searchPlaceholder")}
              />
              <span className={styles.shortcut}>⌘K</span>
            </div>
            <button
              className={styles.addBtn}
              onClick={() => navigate(`/home/lesson-plan/${id}/create`)}
            >
              {t("lessonPlanPage.addTopic")}
            </button>
          </div>
        </div>

        {/* Таблица */}
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            <span className={styles.menuTitle}>
              {t("lessonPlanPage.columns.topic")}
            </span>
            <span className={styles.menuTitle}>
              {t("lessonPlanPage.columns.date")}
            </span>
            <span className={styles.menuTitle}>
              {t("lessonPlanPage.columns.status")}
            </span>
            <span></span>
          </div>

          {loading && <p>{t("lessonPlanPage.status.loading")}</p>}
          {error && <p className={styles.error}>{t("lessonPlanPage.status.error", { error })}</p>}

          {!loading &&
            topics.map((tItem) => (
              <div key={tItem._id} className={styles.row}>
                <span
                  className={styles.topic}
                  onClick={() =>
                    navigate(`/home/lesson-plan/${id}/details/${tItem._id}`)
                  }
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {tItem.title}
                </span>
                <span>{tItem.date || "—"}</span>
                <span
                  className={`${styles.status} ${
                    tItem.status === "published"
                      ? styles.done
                      : styles.planned
                  }`}
                >
                  {tItem.status === "published"
                    ? t("lessonPlanPage.statuses.published")
                    : t("lessonPlanPage.statuses.planned")}
                </span>

                <div className={styles.actionsBtns}>
                  <button
                    title={t("lessonPlanPage.actions.grade")}
                    onClick={() =>
                      navigate(`/home/lesson-plan/${id}/${tItem._id}/grades`)
                    }
                  >
                    <FiStar />
                  </button>
                  <button
                    title={t("lessonPlanPage.actions.edit")}
                    onClick={() =>
                      navigate(`/home/lesson-plan/${id}/details/${tItem._id}`)
                    }
                  >
                    <FiEdit2 />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleLessonPlanPage;