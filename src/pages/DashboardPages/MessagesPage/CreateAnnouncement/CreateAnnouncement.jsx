// src/pages/DashboardPages/MessagesPage/CreateAnnouncement/CreateAnnouncement.jsx
import React, { useState } from "react";
import styles from "./CreateAnnouncement.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import AnnouncementEditor from "../SingleAnnouncement/AnnouncementEdit/AnnouncementEditor/AnnouncementEditor";
import { download } from "../../../../utils/imageGet";
import { createNews } from "../../../../App/Api/News/newsSlice";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";

const CreateAnnouncement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Rejalangan",
    date: new Date().toLocaleString("uz-UZ"),
    image: "",
  });

  const breadcrumbs = [
    { label: t("createAnnouncement.breadcrumbs.list"), to: "/home/messages" },
    { label: t("createAnnouncement.breadcrumbs.create") },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      attachments: form.image ? [{ name: "preview", url: form.image }] : [],
      publishDate: new Date().toISOString(),
    };

    try {
      await dispatch(createNews(payload)).unwrap();
      alert(t("createAnnouncement.alerts.success"));
      navigate("/home/messages");
    } catch (err) {
      alert(t("createAnnouncement.alerts.error", { error: err }));
    }
  };

  return (
    <div className={styles.create}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("createAnnouncement.header.title")}</h2>
        <div className={styles.actions}>
          <button className={styles.dateBtn}>
            <FiCalendar /> {form.date}
          </button>
          <button className={styles.saveBtn} onClick={handleSubmit}>
            {t("createAnnouncement.header.saveBtn")}
          </button>
        </div>
      </div>

      {/* 🔹 Body */}
      <div className={styles.body}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("createAnnouncement.fields.title")}
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={t("createAnnouncement.fields.titlePlaceholder")}
            className={styles.input}
          />
        </div>

        {/* Text Editor */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("createAnnouncement.fields.text")}
          </label>
          <AnnouncementEditor
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
          />
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t("createAnnouncement.fields.status")}
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="Rejalangan">
              {t("createAnnouncement.statusOptions.planned")}
            </option>
            <option value="Yuborilgan">
              {t("createAnnouncement.statusOptions.sent")}
            </option>
          </select>
        </div>

        {/* Upload */}
        <div className={styles.uploadCard}>
          <label className={styles.label}>
            {t("createAnnouncement.fields.image")}
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
                  {t("createAnnouncement.upload.clickToUpload")}
                </span>{" "}
                {t("createAnnouncement.upload.orDrop")}
              </p>
              <span className={styles.hint}>
                {t("createAnnouncement.upload.hint")}
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

export default CreateAnnouncement;