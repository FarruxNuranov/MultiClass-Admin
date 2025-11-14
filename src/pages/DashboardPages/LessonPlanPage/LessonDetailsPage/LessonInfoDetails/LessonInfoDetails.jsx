// src/pages/SettingsPage/LessonPlanPage/LessonInfoDetails/LessonInfoDetails.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import styles from "./LessonInfoDetails.module.scss";

const LessonInfoDetails = ({ topic, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.content}>
      {/* 🔹 Левый блок */}
      <div className={styles.left}>
        <h2 className={styles.sectionTitle}>{topic?.title}</h2>

        {/* ✅ HTML описание */}
        <div
          className={styles.sectionDescription}
          dangerouslySetInnerHTML={{
            __html:
              topic?.description ||
              `<p>${t("lessonInfoDetails.noDescription")}</p>`,
          }}
        />

        {/* Фото */}
        {topic?.images?.length > 0 && (
          <div className={styles.images}>
            {topic.images.map((src, i) => (
              <img key={i} src={src} alt="lesson" />
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Правый блок */}
      <div className={styles.right}>
        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>
            {t("lessonInfoDetails.lessonInfo")}
          </h3>

          <div className={styles.actions}>
            <button className={styles.editBtn} onClick={onEdit}>
              <FiEdit2 /> {t("lessonInfoDetails.buttons.edit")}
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete?.(topic._id)}
            >
              <FiTrash2 /> {t("lessonInfoDetails.buttons.delete")}
            </button>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>👤</span>
            <div>
              <div className={styles.infoclass}>
                {t("lessonInfoDetails.fields.class")}
              </div>
              <div className={styles.infoValue}>
                {topic?.classId?.title || "—"}
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>⏰</span>
            <div>
              <div className={styles.infoclass}>
                {t("lessonInfoDetails.fields.date")}
              </div>
              <div className={styles.infoValue}>
                {topic?.date
                  ? new Date(topic.date).toLocaleDateString()
                  : t("lessonInfoDetails.notSet")}
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.icon}>✍️</span>
            <div>
              <div className={styles.infoclass}>
                {t("lessonInfoDetails.fields.author")}
              </div>
              <div className={styles.infoValue}>
                {topic?.createdBy?.email ||
                  `${topic?.createdBy?.firstName || ""} ${
                    topic?.createdBy?.lastName || ""
                  }` ||
                  "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Материалы */}
        <div className={styles.materialsCard}>
          <h3 className={styles.cardTitle}>
            {t("lessonInfoDetails.materials.title")}
          </h3>
          {topic?.files && topic.files.length > 0 ? (
            <ul>
              {topic.files.map((file, i) => {
                const ext = file.name?.split(".").pop().toLowerCase();
                return (
                  <li key={i} className={styles.fileRow}>
                    <div className={styles.leftMaterial}>
                      <span
                        className={`${styles.fileIcon} ${styles[ext] || ""}`}
                      >
                        {ext?.toUpperCase()}
                      </span>
                      <div className={styles.fileInfo}>
                        <p className={styles.fileName}>{file.name}</p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      title={t("lessonInfoDetails.materials.download")}
                    >
                      <FiDownload />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.noFiles}>
              {t("lessonInfoDetails.materials.noFiles")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonInfoDetails;