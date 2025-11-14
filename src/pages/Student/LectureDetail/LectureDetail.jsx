// src/pages/Student/LectureDetail/LectureDetail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";
import styles from "./LectureDetail.module.scss";
import { skachat } from "../../../utils/imageGet";
import { fetchTopicByIdStudent } from "../../../App/Api/Topics/topicsSlice";

const LectureDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { current: topic, loading, error } = useSelector((s) => s.topics);

  // 📌 Загружаем тему
  useEffect(() => {
    if (id) dispatch(fetchTopicByIdStudent(id));
  }, [dispatch, id]);

  if (loading) return <p>⏳ {t("lectureDetail.loading")}</p>;
  if (error) return <p className={styles.error}>❌ {error}</p>;
  if (!topic) return <p>❌ {t("lectureDetail.notFound")}</p>;

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <FiChevronLeft
          className={styles.backIcon}
          onClick={() => navigate(-1)}
        />
        <h2>{t("lectureDetail.title")}</h2>
      </div>

      {/* 🔹 Контент */}
      <div className={styles.mainBox}>
        <h3 className={styles.lessonTitle}>{topic.title}</h3>

        {/* HTML description */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: topic.description || t("lectureDetail.noDescription"),
          }}
        />

        {/* 🔹 Материалы */}
        <div className={styles.materialsCard}>
          <h4 className={styles.materialsTitle}>
            {t("lectureDetail.materials.title")}
          </h4>

          {(!topic.files || topic.files.length === 0) && (
            <p className={styles.empty}>
              {t("lectureDetail.materials.empty")}
            </p>
          )}

          <div className={styles.materialsList}>
            {(topic.files || []).map((file) => (
              <div key={file._id} className={styles.materialItem}>
                {/* Иконка по расширению */}
                <div
                  className={`${styles.fileIcon} ${
                    styles[file.name.split(".").pop().toLowerCase()] || ""
                  }`}
                >
                  {file.name.split(".").pop().toUpperCase()}
                </div>

                {/* Информация */}
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <span className={styles.fileSize}>
                    {file.size || t("lectureDetail.materials.noSize")}
                  </span>
                </div>

                {/* Скачать */}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                  title={t("lectureDetail.materials.download")}
                >
                  <img src={skachat} alt="download" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureDetail;