// src/pages/SettingsPage/LessonPlanPage/CreateLesson/CreateLesson.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./CreateLesson.module.scss";
import { FiFileText, FiTrash2, FiUploadCloud } from "react-icons/fi";

import { createTopic } from "../../../../../App/Api/Topics/topicsSlice";
import { fetchMeThunk } from "../../../../../App/Api/Auth/getMeSlice";
import AnnouncementEditor from "../../../MessagesPage/SingleAnnouncement/AnnouncementEdit/AnnouncementEditor/AnnouncementEditor";

const CreateLesson = ({ onCancel }) => {
  const { t } = useTranslation();
  const { id: classId } = useParams();
  const { user } = useSelector((state) => state.getMe);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [scienceId, setScienceId] = useState("");

  useEffect(() => {
    if (!user) dispatch(fetchMeThunk());
  }, [dispatch, user]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !classId) {
      alert(t("createLesson.alerts.fillRequired"));
      return;
    }

    const payload = {
      title,
      description,
      files,
      classId,
      science: scienceId,
      date: date || new Date().toISOString(),
    };

    try {
      setLoading(true);
      await dispatch(createTopic(payload)).unwrap();
      navigate(`/home/lesson-plan/${classId}`);
    } catch (err) {
      console.error("Failed to create topic:", err);
      alert(t("createLesson.alerts.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.content}>
      {/* 🔹 Левая часть */}
      <div className={styles.left}>
        {/* Название */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">
            {t("createLesson.fields.title")}{" "}
            <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder={t("createLesson.placeholders.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Предмет */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="science">
            {t("createLesson.fields.subject")}{" "}
            <span className={styles.required}>*</span>
          </label>
          <select
            id="science"
            value={scienceId}
            onChange={(e) => setScienceId(e.target.value)}
          >
            <option value="">{t("createLesson.placeholders.selectSubject")}</option>
            {user?.sciences?.map((sci) => (
              <option key={sci.id} value={sci.id}>
                {sci.title}
              </option>
            ))}
          </select>
        </div>

        {/* Описание (редактор) */}
        <h3 className={styles.sectionTitle}>{t("createLesson.sections.lectureTitle")}</h3>
        <p className={styles.helperText}>{t("createLesson.sections.lectureHelper")}</p>
        <AnnouncementEditor value={description} onChange={setDescription} />

        {/* Материалы */}
        <div className={styles.materialsSection}>
          <h3 className={styles.title}>{t("createLesson.sections.materialsTitle")}</h3>

          {/* Загрузка файлов */}
          <div className={styles.uploadBox}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
            <FiUploadCloud className={styles.uploadIcon} />
            <p>
              <span className={styles.link}>{t("createLesson.upload.click")}</span>{" "}
              {t("createLesson.upload.orDrop")}
            </p>
            <small>{t("createLesson.upload.fileTypes")}</small>
          </div>

          {/* Список файлов */}
          <div className={styles.fileList}>
            {files.length === 0 ? (
              <p className={styles.helper}>{t("createLesson.noFiles")}</p>
            ) : (
              files.map((f, i) => (
                <div key={i} className={styles.fileRow}>
                  <div className={styles.fileInfo}>
                    <FiFileText className={styles.fileIcon} />
                    <div>
                      <div className={styles.fileName}>{f.name}</div>
                      <div className={styles.meta}>
                        <span className={styles.fileSize}>
                          {(f.size / 1024).toFixed(1)} KB
                        </span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.fileStatus}>
                          {t("createLesson.upload.uploaded")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeFile(i)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Дата */}
        <div className={styles.formGroup}>
          <label className={styles.label}>{t("createLesson.fields.date")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button
            onClick={onCancel || (() => navigate(-1))}
            className={styles.cancelBtn}
          >
            {t("createLesson.buttons.cancel")}
          </button>
          <button
            onClick={handleSave}
            className={styles.saveBtn}
            disabled={loading}
          >
            {loading
              ? t("createLesson.buttons.saving")
              : t("createLesson.buttons.save")}
          </button>
        </div>
      </div>

      {/* 🔹 Правая часть */}
      <div className={styles.right}>
        <div className={styles.emptyBox}>
          {t("createLesson.rightBox.placeholder")}
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;