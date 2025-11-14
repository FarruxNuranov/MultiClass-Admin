// src/pages/SettingsPage/SettingsTabs/BranchesSettings/BranchesSettings.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../../../../App/Api/Branches/branchesSlice";

const BranchesSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { list: branches, loading } = useSelector((state) => state.branches);

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 🔹 Filiallarni olish
  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  // 🟣 Modalni ochish (yangi)
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  // 🟣 Modalni ochish (tahrirlash)
  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      address: record.address,
    });
    setOpenModal(true);
  };

  // ✅ Saqlash (create yoki update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title.trim(),
        address: values.address.trim(),
      };

      if (editing) {
        await dispatch(updateBranch({ id: editing._id, data: payload })).unwrap();
        message.success(t("branchesSettings.notifications.updated", "Filial muvaffaqiyatli tahrirlandi!"));
      } else {
        await dispatch(createBranch(payload)).unwrap();
        message.success(t("branchesSettings.notifications.created", "Filial muvaffaqiyatli qo‘shildi!"));
      }

      dispatch(fetchBranches());
      setOpenModal(false);
      setEditing(null);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(t("branchesSettings.notifications.errorSave", "Ma’lumotni saqlashda xatolik!"));
    }
  };

  // ❌ O‘chirish
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBranch(id)).unwrap();
      message.success(t("branchesSettings.notifications.deleted", "Filial o‘chirildi!"));
      dispatch(fetchBranches());
    } catch (err) {
      console.error(err);
      message.error(t("branchesSettings.notifications.errorDelete", "O‘chirishda xatolik!"));
    }
  };

  // 🔹 Jadval ustunlari
  const columns = [
    {
      title: t("branchesSettings.columns.name", "Filial nomi"),
      dataIndex: "title",
      key: "title",
      width: 220,
    },
    {
      title: t("branchesSettings.columns.address", "Manzil"),
      dataIndex: "address",
      key: "address",
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
            title={t("branchesSettings.modal.deleteTitle", "Filialni o‘chirish")}
            description={t("branchesSettings.modal.deleteText", {
              title: record.title,
              defaultValue: `"${record.title}" filialini o‘chirishni istaysizmi?`,
            })}
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

  return (
    <div style={{ background: "var(--colors-background-bg-primary)", borderRadius: 12, padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <EnvironmentOutlined /> {t("settingsPage.tabs.branches", "Filiallar")}
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {t("branchesSettings.addBtn", "Filial qo‘shish")}
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={Array.isArray(branches) ? branches : []}
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      {/* Modal */}
      <Modal
        title={
          editing
            ? t("branchesSettings.modal.editTitle", "Filialni tahrirlash")
            : t("branchesSettings.modal.createTitle", "Yangi filial qo‘shish")
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
            label={t("branchesSettings.modal.labels.name", "Filial nomi")}
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
                "branchesSettings.modal.placeholders.name",
                "Masalan: Asosiy filial"
              )}
            />
          </Form.Item>

          <Form.Item
            label={t("branchesSettings.modal.labels.address", "Manzil")}
            name="address"
            rules={[
              {
                required: true,
                message: t("validation.required", "Majburiy maydon"),
              },
              { max: 200, message: t("validation.max", "Juda uzun (200)") },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t(
                "branchesSettings.modal.placeholders.address",
                "Masalan: Toshkent, Yunusobod tumani, Amir Temur ko‘chasi 101"
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BranchesSettings;
