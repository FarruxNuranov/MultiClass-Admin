// src/pages/AuthPages/Login/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser } from "../../../App/Api/Auth/authSlice";
import styles from "./LoginPage.module.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ROLES } from "../../../config/roles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ i18next tarjima
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const userData = await dispatch(
        loginUser({ phone: formattedPhone, password })
      ).unwrap();

      const role =
        userData?.data?.user?.role ||
        userData?.user?.role ||
        localStorage.getItem("role");

      const token = userData?.data?.token || userData?.token;
      if (token) localStorage.setItem("token", token);
      if (password) localStorage.setItem("password", password);
      if (phone) localStorage.setItem("phone", `+${phone}`);

      const data = userData;

      if (data?.requiresRoleSelection) {
        navigate("/select-role");
        localStorage.setItem("roleSelectionAccounts", JSON.stringify(data.accounts));
        return;
      }

      if (role === ROLES.TEACHER) navigate("/home/teacher");
      else if (role === ROLES.STUDENT || role === ROLES.PARENT)
        navigate("/home/student");
      else navigate("/home/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <h1 className={styles.mobileLogo}>MultiClass</h1>
      <h2 className={styles.title}>{t("login.title")}</h2>
      <p className={styles.subtitle}>{t("login.subtitle")}</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 📱 Telefon raqami */}
        <div className={styles.inputGroup}>
          <label>{t("login.phoneLabel")}</label>
          <PhoneInput
            country={"uz"}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputProps={{
              name: "phone",
              required: true,
            }}
            disableDropdown 
            inputStyle={{
              width: "100%",
              height: "42px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            buttonStyle={{
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* 🔒 Parol */}
        <div className={styles.inputGroup}>
          <label>{t("login.passwordLabel")}</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={t("login.togglePassword")}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* ⚙️ Options */}
        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            {t("login.rememberMe")}
          </label>
          <a href="/forgot-password" className={styles.forgot}>
            {t("login.forgotPassword")}
          </a>
        </div>

        {error && <p className={styles.errorBox}>{String(error)}</p>}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? t("login.loading") : t("login.loginBtn")}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
