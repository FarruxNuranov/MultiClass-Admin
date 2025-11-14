// src/pages/SettingsPage/SettingsTabs/PositionsSettings/PositionsSettings.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  fetchRoleById,
  createRoleThunk,
  updateRoleThunk,
  deleteRoleThunk,
} from "../../../../../App/Api/Roles/rolesSlice";

const PositionsSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: positions, loading } = useSelector((s) => s.roles);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 🔹 Load positions
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // 🔹 Create modal
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  // 🔹 Edit modal
  const openEdit = async (record) => {
    try {
      const res = await dispatch(fetchRoleById(record._id)).unwrap();
      setEditing(res);
      setOpenModal(true);
    } catch (err) {
      message.error(t("positionsSettings.messages.loadError", "Lavozimni yuklashda xatolik"));
    }
  };

  // 🔹 Prefill form
  useEffect(() => {
    if (openModal) {
      if (editing) {
        form.setFieldsValue({ title: editing.title });
      } else {
        form.resetFields();
      }
    }
  }, [openModal, editing, form]);

  // 🔹 Submit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const title = values.title?.trim();
      if (!title) return;

      if (editing) {
        await dispatch(updateRoleThunk({ id: editing._id, data: { title } })).unwrap();
        message.success(t("positionsSettings.messages.updated", "Lavozim yangilandi"));
      } else {
        await dispatch(createRoleThunk({ title })).unwrap();
        message.success(t("positionsSettings.messages.created", "Lavozim qo‘shildi"));
      }

      setOpenModal(false);
      setEditing(null);
      form.resetFields();
    } catch (err) {
      message.error(t("positionsSettings.messages.saveError", "Saqlashda xatolik"));
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteRoleThunk(id)).unwrap();
      message.success(t("positionsSettings.messages.deleted", "Lavozim o‘chirildi"));
    } catch (err) {
      message.error(t("positionsSettings.messages.deleteError", "O‘chirishda xatolik"));
    }
  };

  // 🔹 Table columns
  const columns = [
    {
      title: t("positionsSettings.columns.name", "Nomi"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("positionsSettings.columns.actions", "Amallar"),
      key: "actions",
      width: 160,
      align: "right",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {t("common.edit", "Tahrirlash")}
          </Button>
          <Popconfirm
            title={t("positionsSettings.modal.deleteTitle", "Lavozimni o‘chirish")}
            description={t("positionsSettings.modal.deleteText", {
              title: record.title,
              defaultValue: `“${record.title}” lavozimini o‘chirilsinmi?`,
            })}
            okText={t("positionsSettings.modal.buttons.deleteConfirm", "O‘chirish")}
            cancelText={t("positionsSettings.modal.buttons.deleteCancel", "Bekor qilish")}
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

  return (
    <div style={{ background: "var(--colors-background-bg-primary)", borderRadius: 12, padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{t("positionsSettings.title")}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("positionsSettings.addBtn", "Lavozim qo‘shish")}
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={positions}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FolderOutlined />
            {editing
              ? t("positionsSettings.modal.editTitle", "Lavozimni tahrirlash")
              : t("positionsSettings.modal.createTitle", "Lavozim qo‘shish")}
          </div>
        }
        open={openModal}
        onOk={handleOk}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={
          editing
            ? t("positionsSettings.modal.buttons.save", "Saqlash")
            : t("positionsSettings.modal.buttons.create", "Qo‘shish")
        }
        cancelText={t("positionsSettings.modal.buttons.cancel", "Bekor qilish")}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label={t("positionsSettings.modal.labels.name", "Lavozim nomi")}
            name="title"
            rules={[
              { required: true, message: t("validation.required", "Majburiy maydon") },
              { max: 100, message: t("validation.max", "Juda uzun (100)") },
            ]}
          >
            <Input
              placeholder={t(
                "positionsSettings.modal.placeholders.name",
                "Masalan: Administrator"
              )}
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PositionsSettings;
