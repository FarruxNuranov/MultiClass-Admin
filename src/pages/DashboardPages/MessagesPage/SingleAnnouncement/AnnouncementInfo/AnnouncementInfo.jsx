// src/pages/DashboardPages/MessagesPage/SingleAnnouncement/AnnouncementInfo/AnnouncementInfo.jsx
import React from "react";
import styles from "./AnnouncementInfo.module.scss";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { FiCalendar, FiEdit2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const AnnouncementInfo = ({ announcement, onEditClick }) => {
  const { t } = useTranslation();

  const breadcrumbs = [
    { label: t("announcementInfo.breadcrumbs.list"), to: "/home/messages" },
    { label: t("announcementInfo.breadcrumbs.details") },
  ];

  const hasImage =
    announcement?.attachments?.length > 0 && announcement.attachments[0].url;

  return (
    <div className={styles.info}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Заголовок и кнопки */}
      <div className={styles.header}>
        <h2 className={styles.title}>{announcement.title}</h2>
        <div className={styles.actions}>
          <button className={styles.dateBtn}>
            <FiCalendar />{" "}
            {announcement.publishDate
              ? new Date(announcement.publishDate).toLocaleString("uz-UZ")
              : t("announcementInfo.noDate")}
          </button>
          <button className={styles.editBtn} onClick={onEditClick}>
            <FiEdit2 /> {t("announcementInfo.buttons.edit")}
          </button>
        </div>
      </div>

      {/* 🔹 Контент */}
      <div className={styles.body}>
        {/* Если есть картинка */}
        {hasImage && (
          <div className={styles.imageBox}>
            <img
              src={announcement.attachments[0].url}
              alt={announcement.title}
              className={styles.image}
            />
          </div>
        )}

        {/* Описание */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: announcement.description || "",
          }}
        />
      </div>
    </div>
  );
};

export default AnnouncementInfo;