// src/pages/DashboardPages/MessagesPage/SingleAnnouncement/AnnouncementEdit/AnnouncementEdit.jsx
import React, { useState } from "react";
import styles from "./AnnouncementEdit.module.scss";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { FiCalendar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { download } from "../../../../../utils/imageGet";
import AnnouncementEditor from "./AnnouncementEditor/AnnouncementEditor";

const AnnouncementEdit = ({ announcement, onBackToInfo, onSave }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: announcement?.title || "",
    description: announcement?.description || "",
    status: announcement?.status || "Rejalangan",
    publishDate: announcement?.publishDate || new Date().toISOString(),
    image:
      announcement?.attachments?.length > 0
        ? announcement.attachments[0].url
        : "",
  });

  const breadcrumbs = [
    { label: t("announcementEdit.breadcrumbs.list"), to: "/home/messages" },
    { label: t("announcementEdit.breadcrumbs.details") },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.edit}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("announcementEdit.header.title")}</h2>
        <div className={styles.actions}>
          <div className={styles.datePicker}>
            <label className={styles.label}>
              {t("announcementEdit.header.publishLabel")}
            </label>
            <div className={styles.dateInputBox}>
             
              <input
                type="datetime-local"
                name="publishDate"
                value={
                  form.publishDate
                    ? new Date(form.publishDate).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16)
                }
                onChange={handleChange}
                className={styles.dateInput}
              />
            </div>
          </div>
          <button className={styles.saveBtn} onClick={() => onSave(form)}>
            {t("announcementEdit.header.saveBtn")}
          </button>
          <button className={styles.cancelBtn} onClick={onBackToInfo}>
            {t("announcementEdit.header.cancelBtn")}
          </button>
        </div>
      </div>

      {/* 🔹 Body */}
      <div className={styles.body}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("announcementEdit.fields.title")}
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={t("announcementEdit.fields.titlePlaceholder")}
            className={styles.input}
          />
        </div>

        {/* Text */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("announcementEdit.fields.text")}
          </label>
          <AnnouncementEditor
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
          />
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("announcementEdit.fields.status")}
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="Rejalangan">
              {t("announcementEdit.statusOptions.planned")}
            </option>
            <option value="Yuborilgan">
              {t("announcementEdit.statusOptions.sent")}
            </option>
          </select>
        </div>

        {/* Upload */}
        <div className={styles.uploadCard}>
          <label className={styles.label}>
            {t("announcementEdit.fields.image")}
          </label>
          <div className={styles.uploadBox}>
            <input
              type="file"
              id="upload"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setForm({ ...form, image: URL.createObjectURL(file) });
                }
              }}
            />
            <label htmlFor="upload" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>
                <img src={download} alt="upload" />
              </div>
              <p>
                <span className={styles.link}>
                  {t("announcementEdit.upload.clickToUpload")}
                </span>{" "}
                {t("announcementEdit.upload.orDrop")}
              </p>
              <span className={styles.hint}>
                {t("announcementEdit.upload.hint")}
              </span>
            </label>
          </div>

          {form.image && (
            <div className={styles.preview}>
              <img src={form.image} alt="preview" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementEdit;