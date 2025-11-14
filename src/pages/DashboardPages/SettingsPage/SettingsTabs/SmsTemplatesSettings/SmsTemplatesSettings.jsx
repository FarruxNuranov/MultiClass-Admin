import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Switch,
  Select,
  TimePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchSmsTemplates,
  createSmsTemplateThunk,
  updateSmsTemplateThunk,
  deleteSmsTemplateThunk,
} from "../../../../../App/Api/Sms/smsSlice";

const SmsTemplatesSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.smsTemplates);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [autoSms, setAutoSms] = useState(false);
  const [form] = Form.useForm();

  const paymentStatuses = [
    { label: "Barchasi", value: "all" },
    { label: "To‘langan", value: "payers" },
    { label: "To‘lanmagan", value: "debtors" },
  ];

  const days = Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  // 🔹 SMS shablonlarni olish
  useEffect(() => {
    dispatch(fetchSmsTemplates({ page: 1, limit: 10 }));
  }, [dispatch]);

  // 🔹 Modalni ochish (yangi shablon)
  const openCreate = () => {
    setEditing(null);
    setAutoSms(false);
    form.resetFields();
    setOpenModal(true);
  };

  // 🔹 Modalni ochish (tahrirlash)
  const openEdit = (record) => {
    setEditing(record);
    setAutoSms(record.isAuto || false); // isAuto true bo‘lsa, autoSms yoqiladi

    form.setFieldsValue({
      title: record.title,
      content: record.message,
      day: record.sendDate || undefined,
      time: record.sendTime ? dayjs(record.sendTime, "HH:mm") : null,
      receiver: record.receivers || "all",
    });

    setOpenModal(true);
  };

  // 🔹 Saqlash yoki yangilash
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title.trim(),
        message: values.content.trim(),
        isAuto: autoSms,
        sendDate: autoSms ? values.day : null,
        sendTime: autoSms && values.time ? values.time.format("HH:mm") : null,
        receivers: autoSms ? values.receiver : null,
      };

      if (editing) {
        await dispatch(
          updateSmsTemplateThunk({ id: editing._id, data: payload })
        ).unwrap();
        message.success(
          t("smsTemplatesSettings.messages.updated", "Shablon yangilandi")
        );
      } else {
        await dispatch(createSmsTemplateThunk(payload)).unwrap();
        message.success(
          t("smsTemplatesSettings.messages.created", "Yangi shablon qo‘shildi")
        );
      }

      setOpenModal(false);
      setEditing(null);
      form.resetFields();
    } catch (err) {
      message.error(t("common.error", "Xatolik yuz berdi"));
    }
  };

  // 🔹 Shablonni o‘chirish
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSmsTemplateThunk(id)).unwrap();
      message.success(
        t("smsTemplatesSettings.messages.deleted", "Shablon o‘chirildi")
      );
    } catch {
      message.error(t("common.error", "Xatolik yuz berdi"));
    }
  };

  // 🔹 Jadval ustunlari
  const columns = [
    {
      title: t("smsTemplatesSettings.columns.name", "Shablon nomi"),
      dataIndex: "title",
      key: "title",
      width: 220,
      render: (text, record) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {text}
          {record.isAuto ? (
            <span
              style={{
                background: "var(--colors-background-bg-brand-primary)",
                color: "var(--colors-text-text-brand-secondary-700)",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Avto SMS
            </span>
          ) : null}
        </span>
      ),
    },
    {
      title: t("smsTemplatesSettings.columns.content", "Xabar matni"),
      dataIndex: "message",
      key: "message",
      render: (text) => (
        <span>{text?.length > 80 ? text.slice(0, 80) + "..." : text}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 160,
      align: "right",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {t("common.edit", "Tahrirlash")}
          </Button>
          <Popconfirm
            title={t(
              "smsTemplatesSettings.modal.deleteTitle",
              "Shablonni o‘chirish"
            )}
            description={`"${record.title}" shablonni o‘chirishni istaysizmi?`}
            okText={t("common.delete", "O‘chirish")}
            cancelText={t("common.cancel", "Bekor qilish")}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              {t("common.delete", "O‘chirish")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 🔹 TimePicker cheklovlari (06:00–22:00)
  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) if (i < 6 || i > 21) hours.push(i);
    return hours;
  };

  return (
    <div style={{ background: "var(--colors-background-bg-primary)", borderRadius: 12, padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2
          style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}
        >
          <MessageOutlined /> {t("settingsPage.tabs.sms", "SMS shablonlar")}
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("smsTemplatesSettings.addBtn", "Shablon qo‘shish")}
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editing
            ? t("smsTemplatesSettings.modal.editTitle", "Shablonni tahrirlash")
            : t(
                "smsTemplatesSettings.modal.createTitle",
                "Yangi shablon qo‘shish"
              )
        }
        open={openModal}
        onOk={handleOk}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={
          editing ? t("common.save", "Saqlash") : t("common.create", "Qo‘shish")
        }
        cancelText={t("common.cancel", "Bekor qilish")}
        destroyOnClose
      >
        <Form layout="vertical" form={form} preserve={false}>
          <Form.Item
            label={t("smsTemplatesSettings.modal.labels.name", "Shablon nomi")}
            name="title"
            rules={[{ required: true, message: "Majburiy maydon" }]}
          >
            <Input
              placeholder={t("smsTemplatesSettings.modal.placeholders.name")}
            />
          </Form.Item>

          <Form.Item
            label={t("smsTemplatesSettings.modal.labels.content", "SMS matni")}
            name="content"
            rules={[{ required: true, message: "Majburiy maydon" }]}
            extra={
              <>
                <div>@name@ — {t("sendSms.nameHint")}</div>
                <div>@month@ — {t("sendSms.monthHint")}</div>
              </>
            }
          >
            <Input.TextArea
              rows={4}
              placeholder={t("smsTemplatesSettings.modal.placeholders.content")}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Switch checked={autoSms} onChange={setAutoSms} />
            <span>{t("smsTemplatesSettings.form.autoSmsLabel")}</span>
          </div>

          {autoSms && (
            <>
              <div style={{ display: "flex", gap: 12 }}>
                <Form.Item
                  style={{ flex: 1, marginBottom: 0 }}
                  label={t("smsTemplatesSettings.form.dayLabel")}
                  name="day"
                >
                  <Select
                    placeholder={t("smsTemplatesSettings.form.dayPlaceholder")}
                    options={days}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1, marginBottom: 15 }}
                  label={t("smsTemplatesSettings.form.timeLabel")}
                  name="time"
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%" }}
                    placeholder={t("smsTemplatesSettings.form.timePlaceholder")}
                    disabledHours={disabledHours}
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={t("smsTemplatesSettings.form.receiverLabel")}
                name="receiver"
              >
                <Select
                  placeholder={t(
                    "smsTemplatesSettings.form.receiverPlaceholder"
                  )}
                  options={paymentStatuses}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SmsTemplatesSettings;
