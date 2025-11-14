// src/pages/SettingsPage/SettingsTabs/SubjectsSettings/SubjectsSettings.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Alert,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const SubjectsSettings = ({
  subjects = [],
  loading,
  error,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const { t } = useTranslation();

  // modal & form
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null -> create, object -> edit
  const [form] = Form.useForm();

  // открыть создание
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  // открыть редактирование
  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
  };

  // подставить значения при редактировании
  useEffect(() => {
    if (open) {
      if (editing) {
        form.setFieldsValue({ title: editing.title });
      } else {
        form.resetFields();
      }
    }
  }, [open, editing, form]);

  // сохранить (create/update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const title = values.title?.trim();
      if (!title) return;

      if (editing) {
        await onUpdate?.(editing._id, { title });
      } else {
        await onAdd?.(title);
      }

      setOpen(false);
      setEditing(null);
      form.resetFields();
    } catch {
      // ignore
    }
  };

  // удалить
  const handleDelete = async (id) => {
    await onDelete?.(id);
  };

  const columns = [
    {
      title: t("subjectsSettings.columns.name", "Fan nomi"),
      dataIndex: "title",
      key: "title",
      width: 360,
    },
    {
      title: "",
      key: "actions",
      width: 200,
      align: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{
              fontWeight: 500,
            }}
          >
            Tahrirlash
          </Button>

          <Popconfirm
            title="Tarifni o‘chirish"
            description={`"${record.name}" tarifni o‘chirishni istaysizmi?`}
            okText="O‘chirish"
            cancelText="Bekor qilish"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{
                fontWeight: 500,
              }}
            >
              O‘chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "var(--colors-background-bg-primary)", borderRadius: 12, padding: 16 }}>
      {/* header */}
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
          <BookOutlined /> {t("subjectsSettings.title", "Fanlar")}
        </h2>

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("subjectsSettings.addBtn", "Fan qo‘shish")}
        </Button>
      </div>

      {/* error */}
      {error ? (
        <Alert
          type="error"
          message={t("subjectsSettings.error", "Xatolik")}
          description={String(error)}
          style={{ marginBottom: 12 }}
          showIcon
        />
      ) : null}

      {/* table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={subjects}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description={t("subjectsSettings.empty", "Hali fanlar yo‘q")}
            />
          ),
        }}
        pagination={{ pageSize: 8 }}
      />

      {/* modal */}
      <Modal
        open={open}
        destroyOnClose
        title={
          editing
            ? t("subjectsSettings.modal.editTitle", "Fanni tahrirlash")
            : t("subjectsSettings.modal.createTitle", "Yangi fan qo‘shish")
        }
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={
          editing ? t("common.save", "Saqlash") : t("common.create", "Qo‘shish")
        }
        cancelText={t("common.cancel", "Bekor qilish")}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label={t("subjectsSettings.modal.labels.name", "Fan nomi")}
            name="title"
            rules={[
              {
                required: true,
                message: t("validation.required", "Majburiy maydon"),
              },
              { max: 100, message: t("validation.max", "Juda uzun (100)") },
            ]}
          >
            <Input
              placeholder={t(
                "subjectsSettings.modal.placeholders.name",
                "Masalan: Matematika"
              )}
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectsSettings;
