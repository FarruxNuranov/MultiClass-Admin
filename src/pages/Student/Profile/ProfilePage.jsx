// src/pages/Student/ProfilePage/ProfilePage.jsx
import React, { useEffect } from "react";
import styles from "./ProfilePage.module.scss";
import { FiChevronLeft, FiEdit2, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeThunk } from "../../../App/Api/Auth/getMeSlice";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.getMe);

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <FiChevronLeft className={styles.backIcon} onClick={() => navigate(-1)} />
        <h2>{t("Studentprofile.title")}</h2>
      </div>

      {/* 🔹 User info */}
      <div className={styles.profileBox}>
        <img
          src={user?.avatar || "https://i.pravatar.cc/100?img=32"}
          alt={user?.firstName || "User"}
          className={styles.avatar}
        />
        <div>
          <h3 className={styles.name}>
            {loading
              ? t("Studentprofile.loading")
              : `${user?.firstName || ""} ${user?.lastName || ""}`}
          </h3>
          <p className={styles.phone}>
            {user?.phone || t("Studentprofile.noPhone")}
          </p>
        </div>
      </div>

      {/* 🔹 Settings */}
      <div className={styles.settingsSection}>
        <p className={styles.sectionTitle}>{t("Studentprofile.generalSettings")}</p>

        <div className={styles.settingItem}>
          <div className={styles.left}>
            <FiEdit2 className={styles.icon} />
            <span>{t("Studentprofile.editInfo")}</span>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.settingItem}>
          <div className={styles.left}>
            <FiGlobe className={styles.icon} />
            <span>{t("Studentprofile.appLanguage")}</span>
          </div>

          <div className={styles.langSwitch}>
            <button
              className={`${styles.langBtn} ${
                i18n.language === "uz" ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange("uz")}
              title={t("Studentprofile.langUz")}
            >
              🇺🇿
            </button>
            <button
              className={`${styles.langBtn} ${
                i18n.language === "ru" ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange("ru")}
              title={t("Studentprofile.langRu")}
            >
              🇷🇺
            </button>
            <button
              className={`${styles.langBtn} ${
                i18n.language === "en" ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange("en")}
              title={t("profile.langEn")}
            >
              🇬🇧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;