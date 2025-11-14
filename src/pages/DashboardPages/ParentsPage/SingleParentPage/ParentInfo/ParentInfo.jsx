// src/pages/DashboardPages/ParentsPage/SingleParentPage/ParentInfo/ParentInfo.jsx
import React, { useState } from "react";
import styles from "./ParentInfo.module.scss";
import { FiDownload, FiUser } from "react-icons/fi";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { useTranslation } from "react-i18next";

const subjects = [];

const ParentInfo = ({ parent, onEditClick }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("grades");

  if (!parent) return <div>{t("parentInfo.notFound")}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.headerBg}></div>

      {/* 🔹 Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          {parent.avatar ? (
            <img
              src={parent.avatar}
              alt={parent.firstName}
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
              {parent.firstName} {parent.lastName}
            </h1>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEditClick}>
            {t("parentInfo.edit")}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload /> {t("parentInfo.export")}
          </button>
        </div>
      </div>

      {/* 🔹 Info */}
      <div className={styles.infoSection}>
        <div className={styles.leftInfo}>
          <p className={styles.label}>{t("parentInfo.address")}</p>
          <p className={styles.value}>{parent.address || "—"}</p>

          <p className={styles.label}>{t("parentInfo.telegram")}</p>
          <a
            href={`https://t.me/${parent.telegram?.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {parent.telegram || "—"}
          </a>

          <p className={styles.label}>{t("parentInfo.phone")}</p>
          <a href={`tel:${parent.phone}`} className={styles.link}>
            {parent.phone || "—"}
          </a>
        </div>

        <div className={styles.rightInfo}>
          <h3>{t("parentInfo.summaryTitle")}</h3>
          <p>{parent.bio || t("parentInfo.summaryEmpty")}</p>
        </div>
      </div>

      {/* 🔹 Children */}
      <div className={styles.childrenSection}>
        <div className={styles.childBox}>
          <span className={styles.childLabel}>{t("parentInfo.childLabel")}</span>
          {parent.children?.[0]?.avatar ? (
            <img
              src={parent.children[0].avatar}
              alt={parent.children[0].name}
              className={styles.childAvatar}
            />
          ) : (
            <FiUser className={styles.childAvatarIcon} />
          )}
          <p className={styles.childName}>
            {parent.children?.[0]?.name || "—"}
          </p>
        </div>

        <div className={styles.tabsBox}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "grades" ? styles.active : ""}`}
              onClick={() => setActiveTab("grades")}
            >
              {t("parentInfo.tabs.grades")}
            </button>
            <button
              className={`${styles.tab} ${activeTab === "summary" ? styles.active : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              {t("parentInfo.tabs.summary")}
            </button>
            <button
              className={`${styles.tab} ${activeTab === "docs" ? styles.active : ""}`}
              onClick={() => setActiveTab("docs")}
            >
              {t("parentInfo.tabs.docs")}
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* 🔹 Grades */}
            {activeTab === "grades" && (
              <>
                {subjects.length > 0 ? (
                  <table className={styles.subjectsTable}>
                    <thead>
                      <tr>
                        <th>{t("parentInfo.table.subject")}</th>
                        <th>{t("parentInfo.table.grades")}</th>
                        <th>{t("parentInfo.table.avg")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.name}</td>
                          <td>
                            {s.grades.map((g, i) => (
                              <span
                                key={i}
                                className={`${styles.grade} ${
                                  g >= 5
                                    ? styles.good
                                    : g === 4
                                    ? styles.medium
                                    : styles.bad
                                }`}
                              >
                                {g}
                              </span>
                            ))}
                          </td>
                          <td>{s.avg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.noMarks}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/7476/7476936.png"
                      alt="no data"
                    />
                    <p>{t("parentInfo.noGrades.title")}</p>
                    <span>{t("parentInfo.noGrades.desc")}</span>
                  </div>
                )}
              </>
            )}

            {/* 🔹 Summary */}
            {activeTab === "summary" && <p>{t("parentInfo.summaryText")}</p>}

            {/* 🔹 Docs */}
            {activeTab === "docs" && (
              <div className={styles.docsGrid}>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className={styles.docCard}>
                    <img
                      src={`https://picsum.photos/400/250?random=${i + 70}`}
                      alt={`Doc ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;