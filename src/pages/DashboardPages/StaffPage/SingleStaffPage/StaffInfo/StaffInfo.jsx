import React from "react";
import styles from "./StaffInfo.module.scss";
import { FiDownload, FiUser } from "react-icons/fi";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";

const StaffInfo = ({ staff, onEditClick }) => {
  const { t } = useTranslation();

  if (!staff) return <div>{t("staffInfo.notFound")}</div>;

  return (
    <div className={styles.page}>
      {/* 🔹 Header background */}
      <div className={styles.headerBg}></div>

      {/* 🔹 Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          {staff.avatar ? (
            <img
              src={staff.avatar}
              alt={staff.firstName}
              className={styles.avatar}
            />
          ) : (
            <FiUser className={styles.avatarIcon} />
          )}

          <div>
            <div className={styles.breadcrumbs}>
              <Breadcrumbs />
            </div>
            <h1 className={styles.name}>
              {staff.firstName} {staff.lastName}
              <span className={styles.roleBadge}>
                {staff.role?.title || "—"}
              </span>
            </h1>
            <p className={styles.email}>{staff.email || "—"}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEditClick}>
            {t("staffInfo.edit")}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload /> {t("staffInfo.export")}
          </button>
        </div>
      </div>

      {/* 🔹 Info section */}
      <div className={styles.infoSection}>
        {/* Left column */}
        <div className={styles.leftInfo}>
          <p className={styles.label}>{t("staffInfo.address")}</p>
          <p className={styles.value}>{staff.address || "Tashkent, Uzbekistan"}</p>

          <p className={styles.label}>{t("staffInfo.telegram")}</p>
          <a
            href={`https://t.me/${staff.telegram?.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {staff.telegram || "—"}
          </a>

          <p className={styles.label}>{t("staffInfo.phone")}</p>
          <a href={`tel:${staff.phone}`} className={styles.link}>
            {staff.phone || "—"}
          </a>

          <p className={styles.label}>{t("staffInfo.salary")}</p>
          <p className={styles.value}>{staff.salary || "0"}</p>

          <p className={styles.label}>{t("staffInfo.branch")}</p>
          <p className={styles.value}>
            {staff.branch?.length
              ? staff.branch.map((b) => b.title || b.name).join(", ")
              : "—"}
          </p>

          <p className={styles.label}>{t("staffInfo.class")}</p>
          <p className={styles.value}>
            {staff.class?.length
              ? staff.class.map((c) => `${c.grade}${c.title}`).join(", ")
              : "—"}
          </p>
        </div>

        {/* Right column */}
        <div className={styles.rightInfo}>
          <h3>{t("staffInfo.aboutTitle")}</h3>
          <p>{staff.bio || t("staffInfo.aboutEmpty")}</p>
          <a href="#" className={styles.moreLink}>
            {t("staffInfo.more")}
          </a>
        </div>
      </div>

      {/* 🔹 Documents */}
      <div className={styles.docsSection}>
        <div className={styles.docsLeft}>
          <h3>{t("staffInfo.docsTitle")}</h3>
        </div>
        <div className={styles.docsRight}>
          <div className={styles.docsGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.docCard}>
                <img
                  src={`https://picsum.photos/400/250?random=${i + 30}`}
                  alt={`Doc ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInfo;
