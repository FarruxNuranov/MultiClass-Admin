import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, message } from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./VerificationSent.module.scss";

const { Title, Text } = Typography;

const FAKE_CODE = "1234";

const VerificationSent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "+998 99 842 79 79";

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    if (enteredCode.length < 4)
      return message.warning(t("verification.enterFullCode"));

    setLoading(true);
    setTimeout(() => {
      if (enteredCode === FAKE_CODE) {
        message.success(t("verification.success"));
        navigate("/resetpassword");
      } else {
        message.error(t("verification.incorrectCode"));
      }
      setLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      message.success(t("verification.codeResent"));
      setTimer(30);
      setResending(false);
    }, 800);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridCircle}></div>

      <div className={styles.card}>
        <div className={styles.iconBox}>
          <MailOutlined className={styles.icon} />
        </div>

        <Title level={3} className={styles.title}>
          {t("verification.title")}
        </Title>

        <Text className={styles.subtitle}>
          {t("verification.subtitleBefore")}{" "}
          <span className={styles.phone}>{phone}</span>{" "}
          {t("verification.subtitleAfter")}
        </Text>

        <div className={styles.codeBox}>
          {code.map((num, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={num}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className={styles.codeInput}
              type="text"
              inputMode="numeric"
            />
          ))}
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleVerify}
          className={styles.verifyBtn}
        >
          {t("verification.verifyBtn")}
        </Button>

        <div className={styles.resendBox}>
          {timer > 0 ? (
            <Text type="secondary">
              {t("verification.resendIn", { timer })}
            </Text>
          ) : (
            <span
              className={styles.resend}
              onClick={!resending ? handleResend : undefined}
            >
              {resending
                ? t("verification.resending")
                : t("verification.resend")}
            </span>
          )}
        </div>

        <div className={styles.backLink} onClick={() => navigate("/login")}>
          <ArrowLeftOutlined />
          <span>{t("verification.backToLogin")}</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationSent;
