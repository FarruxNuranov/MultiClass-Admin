// src/pages/DashboardPages/MessagesPage/MessagesPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MessagesPage.module.scss";
import { FiPlus } from "react-icons/fi";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../../App/Api/News/newsSlice";
import { useTranslation } from "react-i18next";

const MessagesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const breadcrumbs = [{ label: t("messagesPage.breadcrumbs") }];

  const { list: news, loading, error } = useSelector((s) => s.news);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      {/* 🔹 Breadcrumbs */}
    

      {/* 🔹 Header */}
      <div className={styles.header}>
        <h2>{t("messagesPage.title")}</h2>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/home/messages/create")}
        >
          <FiPlus /> {t("messagesPage.addBtn")}
        </button>
      </div>

      {/* 🔹 News List */}
      <div className={styles.grid}>
        {loading && <p>{t("messagesPage.loading")}</p>}
        {error && (
          <p className={styles.error}>{t("messagesPage.error", { error })}</p>
        )}

        {!loading &&
          news?.map((item) => (
            <div
              key={item._id}
              className={styles.card}
              onClick={() => navigate(`/home/messages/${item._id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* Image */}
              <div className={styles.imageBox}>
                <img
                  src={
                    item.attachments?.[0]?.url &&
                    item.attachments?.[0]?.url !== "string"
                      ? item.attachments[0].url
                      : `https://picsum.photos/400/200?random=${Math.floor(
                          Math.random() * 1000
                        )}`
                  }
                  alt={item.title}
                  className={styles.image}
                />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.meta}>
                  <span className={styles.status}>
                    {item.publishDate
                      ? t("messagesPage.status.planned")
                      : t("messagesPage.status.sent")}
                  </span>
                  <span className={styles.date}>
                    {item.publishDate
                      ? new Date(item.publishDate).toLocaleDateString("uz-UZ")
                      : new Date(item.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <h3 className={styles.title}>{item.title}</h3>
                <div
                  className={styles.desc}
                  dangerouslySetInnerHTML={{
                    __html:
                      item.description?.length > 120
                        ? item.description.slice(0, 120) + "..."
                        : item.description || "",
                  }}
                ></div>
              </div>
            </div>
          ))}
      </div>

      {/* 🔹 Pagination */}
      <div className={styles.pagination}>
        <div className={styles.left}>
          <span className={styles.titlePagination}>
            {t("messagesPage.pagination.pageInfo", { current: 1, total: 10 })}
          </span>
          <select>
            <option value="10">{t("messagesPage.pagination.options.10")}</option>
            <option value="20">{t("messagesPage.pagination.options.20")}</option>
            <option value="50">{t("messagesPage.pagination.options.50")}</option>
            <option value="100">{t("messagesPage.pagination.options.100")}</option>
          </select>
        </div>

        <div className={styles.right}>
          <button className={styles.pageBtn}>
            {t("messagesPage.pagination.prev")}
          </button>
          <button className={styles.pageBtn}>
            {t("messagesPage.pagination.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;