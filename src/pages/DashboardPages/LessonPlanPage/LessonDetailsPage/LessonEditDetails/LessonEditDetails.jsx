// src/pages/SettingsPage/LessonPlanPage/LessonEditDetails/LessonEditDetails.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiFileText, FiTrash2, FiUploadCloud } from "react-icons/fi";
import styles from "./LessonEditDetails.module.scss";

import { updateTopic } from "../../../../../App/Api/Topics/topicsSlice";
import { fetchMeThunk } from "../../../../../App/Api/Auth/getMeSlice";
import AnnouncementEditor from "../../../MessagesPage/SingleAnnouncement/AnnouncementEdit/AnnouncementEditor/AnnouncementEditor";

const LessonEditDetails = ({ topic, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.getMe);

  const [title, setTitle] = useState(topic?.title || "");
  const [description, setDescription] = useState(topic?.description || "");
  const [files, setFiles] = useState(topic?.files || []);
  const [date, setDate] = useState(topic?.date?.split("T")[0] || "");
  const [scienceId, setScienceId] = useState(topic?.science_id || "");

  // 🔹 Подгружаем данные пользователя (для списка предметов)
  useEffect(() => {
    if (!user) dispatch(fetchMeThunk());
  }, [dispatch, user]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !scienceId) {
      alert(t("lessonEditDetails.alerts.fillRequired"));
      return;
    }

    dispatch(
      updateTopic({
        id: topic._id,
        data: {
          title,
          description,
          files,
          date: date || new Date().toISOString(),
          classId: topic.classId?._id || topic.classId,
          science: scienceId,
        },
      })
    );

    onCancel();
  };

  return (
    <div className={styles.content}>
      <div className={styles.left}>
        {/* Название */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t("lessonEditDetails.fields.title")}{" "}
            <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("lessonEditDetails.placeholders.title")}
          />
        </div>

        {/* Выбор предмета */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            {t("lessonEditDetails.fields.subject")}{" "}
            <span className={styles.required}>*</span>
          </label>
          <select
            value={scienceId}
            onChange={(e) => setScienceId(e.target.value)}
          >
            <option value="">{t("lessonEditDetails.placeholders.selectSubject")}</option>
            {user?.sciences?.map((sci) => (
              <option key={sci.id} value={sci.id}>
                {sci.title}
              </option>
            ))}
          </select>
        </div>

        {/* Текст лекции */}
        <h3 className={styles.sectionTitle}>{t("lessonEditDetails.sections.lectureTitle")}</h3>
        <p className={styles.helperText}>{t("lessonEditDetails.sections.lectureHelper")}</p>

        <div className={styles.editorBox}>
          <AnnouncementEditor value={description} onChange={setDescription} />
        </div>

        {/* Материалы */}
        <div className={styles.materialsSection}>
          <h3 className={styles.title}>{t("lessonEditDetails.sections.materialsTitle")}</h3>
          <p className={styles.helper}>{t("lessonEditDetails.sections.materialsHelper")}</p>

          <div className={styles.uploadBox}>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
            <FiUploadCloud className={styles.uploadIcon} />
            <p>
              <span className={styles.link}>{t("lessonEditDetails.upload.click")}</span>{" "}
              {t("lessonEditDetails.upload.orDrop")}
            </p>
            <small>{t("lessonEditDetails.upload.fileTypes")}</small>
          </div>

          <div className={styles.fileList}>
            {files.map((file, i) => (
              <div key={i} className={styles.fileRow}>
                <div className={styles.fileInfo}>
                  <FiFileText className={styles.fileIcon} />
                  <p className={styles.fileName}>{file.name}</p>
                </div>
                <button className={styles.deleteBtn} onClick={() => removeFile(i)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Дата */}
        <div className={styles.formGroup}>
          <label className={styles.label}>{t("lessonEditDetails.fields.date")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            {t("lessonEditDetails.buttons.cancel")}
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            {t("lessonEditDetails.buttons.save")}
          </button>
        </div>
      </div>

      <div className={styles.right}></div>
    </div>
  );
};

export default LessonEditDetails;