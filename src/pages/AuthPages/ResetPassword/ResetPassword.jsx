import React, { useState } from "react";
import { Input, Button, Typography, message } from "antd";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ResetPassword.module.scss";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🔹 i18n tarjima hook

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = () => {
    if (!password || !confirm) {
      message.warning(t("resetPassword.emptyWarning"));
      return;
    }
    if (password !== confirm) {
      message.error(t("resetPassword.mismatchError"));
      return;
    }
    if (!isValidLength || !hasSpecialChar) {
      message.error(t("resetPassword.weakPassword"));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(t("resetPassword.success"));
      navigate("/login");
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridCircle}></div>

      <div className={styles.card}>
        <div className={styles.iconBox}>
          <LockOutlined className={styles.icon} />
        </div>

        <Title level={3} className={styles.title}>
          {t("resetPassword.title")}
        </Title>

        <Text className={styles.subtitle}>
          {t("resetPassword.subtitle")}
        </Text>

        <div className={styles.form}>
          <label>{t("resetPassword.passwordLabel")}</label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("resetPassword.passwordPlaceholder")}
            className={styles.input}
          />

          <label>{t("resetPassword.confirmPasswordLabel")}</label>
          <Input.Password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
            className={styles.input}
          />
        </div>

        <div className={styles.rules}>
          <Text type={isValidLength ? "success" : "secondary"}>
            {t("resetPassword.ruleLength")}
          </Text>
          <Text type={hasSpecialChar ? "success" : "secondary"}>
            {t("resetPassword.ruleSpecial")}
          </Text>
        </div>

        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          onClick={handleSubmit}
          className={styles.saveBtn}
        >
          {t("resetPassword.saveBtn")}
        </Button>

        <div className={styles.backLink} onClick={() => navigate("/login")}>
          <ArrowLeftOutlined />
          <span>{t("resetPassword.backToLogin")}</span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
