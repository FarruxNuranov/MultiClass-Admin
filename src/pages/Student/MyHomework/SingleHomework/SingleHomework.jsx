// src/pages/DashboardPages/HomeworkPage/SingleHomework/SingleHomework.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "./SingleHomework.module.scss";
import { redTime, doneCheck, download } from "../../../../utils/imageGet";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import {
  fetchHomeworkById,
} from "../../../../App/Api/homework/homeworkSlice";
import { createAssignmentThunk } from "../../../../App/Api/assignments/assignmentsSlice";

const SingleHomework = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { current: homework, loading, error } = useSelector((s) => s.homework);
  const { loading: uploading } = useSelector((s) => s.assignments);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (id) dispatch(fetchHomeworkById(id));
  }, [dispatch, id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      raw: f,
    }));
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (!homework?._id || selectedFiles.length === 0) return;
    await dispatch(
      createAssignmentThunk({
        homeworkId: homework._id,
        files: selectedFiles.map((f) => ({ name: f.name, url: f.url })),
      })
    ).unwrap();
    dispatch(fetchHomeworkById(id));
    setSelectedFiles([]);
  };

  if (loading) return <p className={styles.loader}>⏳ {t("singleHomework.loading")}</p>;
  if (error) return <p className={styles.error}>❌ {error}</p>;
  if (!homework) return <p className={styles.error}>❌ {t("singleHomework.notFound")}</p>;

  const status = homework.assignment?.status;
  const statusText =
    status === "graded"
      ? t("singleHomework.status.graded")
      : status === "pending"
      ? t("singleHomework.status.pending")
      : t("singleHomework.status.notSubmitted");

  const statusIcon = status === "graded" ? doneCheck : redTime;

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <FiChevronLeft className={styles.backIcon} onClick={() => navigate(-1)} />
        <h2>
          {homework.science || t("singleHomework.subject")} {t("singleHomework.homework")}
        </h2>
      </div>

      <div className={styles.mainBox}>
        {/* 🔹 Status card */}
        <div className={styles.statusCard}>
          <div className={styles.topRow}>
            <div>
              <h3 className={styles.subject}>{homework.science}</h3>
              <p className={styles.date}>
                {new Date(homework.createdAt).toLocaleDateString("uz-UZ")}
              </p>
            </div>
            <span
              className={`${styles.status} ${
                status === "graded"
                  ? styles.success
                  : status === "pending"
                  ? styles.pending
                  : styles.failed
              }`}
            >
              <img src={statusIcon} alt="status" className={styles.statusIcon} />
              {statusText}
            </span>
          </div>

          {/* 🔹 Results */}
          <div className={styles.resultBox}>
            <div className={styles.resultItem}>
              <p className={styles.value}>{homework.mark || 0}</p>
              <span className={styles.label}>{t("singleHomework.grade")}</span>
            </div>
            <div className={`${styles.resultItem} ${styles.withBorder}`}>
              <p className={styles.value}>{homework.max_mark || 10}</p>
              <span className={styles.label}>{t("singleHomework.maxGrade")}</span>
            </div>
            <div className={styles.resultItem}>
              <p className={styles.value}>
                {homework.max_mark
                  ? ((homework.mark / homework.max_mark) * 100).toFixed(0)
                  : 0}
                %
              </p>
              <span className={styles.label}>{t("singleHomework.result")}</span>
            </div>
          </div>
        </div>

        {/* 🔹 Lecture */}
        <div className={styles.lectureCard}>
          <h4>{homework.topic?.title}</h4>
          <p>{homework.description || t("singleHomework.noInfo")}</p>
          <button
            className={styles.linkBtn}
            onClick={() =>
              navigate(`/home/student/homework/${homework.topic._id}/student`)
            }
          >
            {t("singleHomework.lectureBtn")} <FiChevronRight size={20} />
          </button>
        </div>

        {/* 🔹 Upload Section */}
        <div className={styles.uploadCard}>
          <h4 className={styles.uploadTitle}>{t("singleHomework.uploadTitle")}</h4>

          {!homework.assignment ? (
            <>
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  id="upload"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="upload" className={styles.uploadLabel}>
                  <div className={styles.uploadIcon}>
                    <img src={download} alt="upload" />
                  </div>
                  <p>
                    <span className={styles.link}>{t("singleHomework.upload.click")}</span>{" "}
                    {t("singleHomework.upload.orDrop")}
                  </p>
                  <span className={styles.hint}>{t("singleHomework.upload.hint")}</span>
                </label>
              </div>

              <div className={styles.fileList}>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className={styles.fileItem}>
                    <div className={styles.fileIcon}>
                      {file.name.split(".").pop().toUpperCase()}
                    </div>
                    <div className={styles.fileInfo}>
                      <p className={styles.fileName}>{file.name}</p>
                      <span className={styles.fileSize}>
                        {t("singleHomework.upload.new")}
                      </span>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {selectedFiles.length > 0 && (
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={uploading}
                >
                  {uploading
                    ? t("singleHomework.upload.loading")
                    : t("singleHomework.upload.submit")}
                </button>
              )}
            </>
          ) : (
            <div className={styles.fileList}>
              {(homework.assignment.files || []).map((file, idx) => (
                <div key={idx} className={styles.fileItem}>
                  <div className={styles.fileIcon}>
                    {file.name.split(".").pop().toUpperCase()}
                  </div>
                  <div className={styles.fileInfo}>
                    <p className={styles.fileName}>{file.name}</p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fileSize}
                    >
                      {t("singleHomework.upload.download")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleHomework;