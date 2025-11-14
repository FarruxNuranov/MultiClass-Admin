import React, { useEffect } from "react";
import {
  Modal,
  Select,
  Input,
  Button,
  Typography,
  Space,
  message,
  notification,
} from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSmsTemplates,
  sendBulkSmsThunk,
} from "../../../../../App/Api/Sms/smsSlice";
import { MessageOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Text, Title } = Typography;

const SendSmsModal = ({ open, onCancel, receivers = [], selectedStudent }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    list: smsTemplates,
    loading,
    sendingBulk,
  } = useSelector((state) => state.smsTemplates);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [messageText, setMessageText] = React.useState("");
  const [api, contextHolder] = notification.useNotification(); // ✅ hook ishlatamiz

  useEffect(() => {
    if (open) {
      dispatch(fetchSmsTemplates());
      setSelectedTemplate(null);
      setMessageText("");
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (selectedTemplate && smsTemplates.length > 0) {
      const template = smsTemplates.find((t) => t._id === selectedTemplate);
      if (template) {
        setMessageText(template.message);
      }
    }
  }, [selectedTemplate, smsTemplates]);
  const handleSend = async () => {
    if (!messageText?.trim()) {
      return message.error(t("sendSms.emptyMessage"));
    }
    try {
      const phone = []
      if (selectedStudent)phone.push(selectedStudent.phone)
      await dispatch(
        sendBulkSmsThunk({
          message: messageText,
          phones: selectedStudent ? phone : receivers,
        })
      ).unwrap();

      api.success({
        message: t("sendSms.successTitle") || "SMS yuborildi!",
        description:
          t("sendSms.successDesc") ||
          "Tanlangan foydalanuvchilarga SMS muvaffaqiyatli yuborildi.",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        placement: "topRight",
        duration: 3,
      });

      onCancel();
    } catch (err) {
      api.error({
        message: t("sendSms.errorTitle") || "Xatolik",
        description:
          err || t("sendSms.errorDesc") || "SMS yuborishda muammo yuz berdi.",
        placement: "topRight",
      });
    }
  };

  return (
    <>
      {contextHolder} {/* ✅ notification ishlashi uchun */}
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        width={600}
        centered
        closable
        title={null}
        styles={{
          content: {
            border: "none",
            boxShadow: "none",
            background: "var(--colors-background-bg-primary)",
          },
          body: {
            padding: "28px 32px 24px",
            borderRadius: 20,
            background: "var(--colors-background-bg-primary)",
          },
        }}
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {/* Header */}
          <Space align="center" size={12}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--colors-background-bg-brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "var(--colors-text-text-brand-secondary-700)",
              }}
            >
              <MessageOutlined />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {t("sendSms.title")}
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {t("sendSms.subtitle")}
              </Text>
            </div>
          </Space>

          {/* Select */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>
              {t("sendSms.templateLabel")}
            </Text>
            <Select
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              placeholder={t("sendSms.templatePlaceholder")}
              size="large"
              style={{ width: "100%" }}
              loading={loading}
              options={smsTemplates.map((tpl) => ({
                value: tpl._id,
                label: tpl.title,
                message: tpl.message,
              }))}
              showSearch
              optionFilterProp="label"
            />
          </div>

          {/* Textarea */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>
              {t("sendSms.messageLabel")}
            </Text>
            <TextArea
              rows={4}
              placeholder={t("sendSms.messagePlaceholder")}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled
              style={{
                borderRadius: 10,
                resize: "none",
                background: "var(--colors-background-bg-primary)",
                color: "var(--colors-text-text-primary-900)",
                borderColor: "var(--colors-border-border-secondary)",
              }}
            />
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--colors-text-text-quaternary-500)" }}>
              <div>@name@ — {t("sendSms.nameHint")}</div>
              <div>@month@ — {t("sendSms.monthHint")}</div>
            </div>
          </div>

          {/* Footer buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 8,
            }}
          >
            <Button
              size="large"
              onClick={onCancel}
              style={{
                borderRadius: 10,
                fontWeight: 500,
                padding: "0 24px",
              }}
            >
              {t("sendSms.cancel")}
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSend}
              loading={sendingBulk}
              style={{
                borderRadius: 10,
                fontWeight: 600,
                padding: "0 24px",
                background: "var(--colors-background-bg-brand-solid)",
                borderColor: "var(--colors-background-bg-brand-solid)",
              }}
            >
              {t("sendSms.send")}
            </Button>
          </div>
        </Space>
      </Modal>
    </>
  );
};

export default SendSmsModal;
