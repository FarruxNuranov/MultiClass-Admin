// src/Layout/Auth/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./AuthLayout.module.scss";

const AuthLayout = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className={styles.wrapper}>
      {/* Chap qism: forma */}
      <div className={styles.left}>
        <Outlet />
      </div>

      {/* O‘ng qism: fon + matn + til tanlash */}
      <div className={styles.right}>
        <div className={styles.langSwitch}>
          {["uz", "ru", "en"].map((lang) => (
            <button
              key={lang}
              className={`${styles.langBtn} ${
                i18n.language === lang ? styles.active : ""
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang === "uz" && "🇺🇿 UZ"}
              {lang === "ru" && "🇷🇺 RU"}
              {lang === "en" && "🇬🇧 EN"}
            </button>
          ))}
        </div>

        <div className={styles.textBlock}>
          <h2>Welcome to your new dashboard 🚀</h2>
          <p>Sign in to explore changes we’ve made.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
