// src/pages/Student/MyHomework/MyHomework.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";
import styles from "./MyHomework.module.scss";
import { doneCheck, redTime } from "../../../utils/imageGet";
import { fetchMyHomework } from "../../../App/Api/homework/homeworkSlice";

const MyHomework = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myItems, loading, error } = useSelector((s) => s.homework);

  useEffect(() => {
    dispatch(fetchMyHomework());
  }, [dispatch]);

  const renderStatus = (status) => {
    if (status === "graded") {
      return {
        text: t("myHomework.status.graded"),
        icon: doneCheck,
        className: styles.success,
      };
    }
    if (status === "pending") {
      return {
        text: t("myHomework.status.pending"),
        icon: redTime,
        className: styles.pending,
      };
    }
    return {
      text: t("myHomework.status.notSubmitted"),
      icon: redTime,
      className: styles.failed,
    };
  };

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <FiChevronLeft className={styles.backIcon} onClick={() => navigate(-1)} />
        <h2>{t("myHomework.title")}</h2>
      </div>

      <div className={styles.mainBox}>
        {/* 🔹 Section title */}
        <div className={styles.sectionTitle}>{t("myHomework.subtitle")}</div>

        {/* 🔹 States */}
        {loading && <p>⏳ {t("myHomework.loading")}</p>}
        {error && <p className={styles.error}>❌ {error}</p>}
        {!loading && myItems.length === 0 && (
          <p>❌ {t("myHomework.empty")}</p>
        )}

        {/* 🔹 List */}
        <div className={styles.taskList}>
          {myItems.map((task) => {
            const status = renderStatus(task.status);
            return (
              <div
                key={task._id}
                className={styles.taskCard}
                onClick={() => navigate(`/home/student/homework/${task._id}`)}
              >
                <div className={styles.topRow}>
                  <h3 className={styles.subject}>
                    {task.science || task.topic?.title || t("myHomework.unknownSubject")}
                  </h3>
                  <span className={`${styles.status} ${status.className}`}>
                    <img
                      src={status.icon}
                      alt="status"
                      className={styles.statusIcon}
                    />
                    {status.text}
                  </span>
                </div>
                <p className={styles.description}>
                  {task.description || t("myHomework.noDescription")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyHomework;