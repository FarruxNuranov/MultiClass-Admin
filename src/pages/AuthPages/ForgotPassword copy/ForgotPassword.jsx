// src/pages/AuthPages/ForgotPassword/ForgotPasswordPage.jsx
import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { ArrowLeftOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ForgotPassword.module.scss";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onFinish = (values) => {
    console.log("Yuborilgan ma'lumot:", values);
    navigate("/verification");
  };

  return (
    <div className={styles.wrapper}>
      {/* 🔳 Katakli doira fon */}
      <div className={styles.gridCircle}></div>

      {/* 📦 Card */}
      <div className={styles.card}>
        <div className={styles.iconBox}>
          <KeyOutlined className={styles.icon} />
        </div>

        <Title level={3} className={styles.title}>
          {t("forgotPassword.title")}
        </Title>

        <Text className={styles.subtitle}>{t("forgotPassword.subtitle")}</Text>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={t("forgotPassword.phoneLabel")}
            name="phone"
            rules={[
              { required: true, message: t("forgotPassword.errors.required") },
              {
                pattern: /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
                message: t("forgotPassword.errors.invalidFormat"),
              },
            ]}
          >
            <Input
              placeholder={t("forgotPassword.phonePlaceholder")}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              className={styles.btnSubmit}
              htmlType="submit"
              size="large"
              block
            >
              {t("forgotPassword.resetBtn")}
            </Button>
          </Form.Item>
        </Form>

        <div
          className={styles.backLink}
          onClick={() => {
            console.log("test");
            navigate("/login");
          }}
        >
          <ArrowLeftOutlined />
          <span>{t("forgotPassword.backToLogin")}</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
