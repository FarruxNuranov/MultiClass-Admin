import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Alert,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers } from "../../../../../App/Api/Teachers/teachersSlice";
import { fetchClasses } from "../../../../../App/Api/Classes/classesSlice";
import { fetchBranches } from "../../../../../App/Api/Branches/branchesSlice";
import { useTranslation } from "react-i18next";
import { teacherId } from "../../../../../config/config";

const { Option } = Select;

const ClassesSettings = ({ onAdd, onUpdate, onDelete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // === Redux store ===
  const { list: teachers = [], loading: tLoading, error: tError } = useSelector(
    (s) => s.employees || {}
  );
  const { items: classes = [], loading, error } = useSelector((s) => s.classes || {});
  const { list: branches = [], loading: bLoading } = useSelector((s) => s.branches || {});

  // === Local state ===
  const [branchId, setBranchId] = useState(""); // 🔹 активный филиал
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // === Fetch branches ===
  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  // === Когда филиалы подгрузились — выбрать первый по умолчанию ===
  useEffect(() => {
    if (branches.length > 0 && !branchId) {
      setBranchId(branches[0]._id); // ✅ по умолчанию — первый филиал
    }
  }, [branches, branchId]);

  // === Fetch classes по выбранному филиалу ===
  useEffect(() => {
    if (branchId) dispatch(fetchClasses({ branch: branchId }));
  }, [dispatch, branchId]);

  // === Fetch teachers (один раз при открытии модалки) ===
  useEffect(() => {
    if (open && teachers.length === 0) dispatch(fetchTeachers({roles:teacherId}));
  }, [open, teachers.length, dispatch]);

  // === Map of teachers ===
  const teacherMap = useMemo(() => {
    const m = new Map();
    teachers.forEach((t) => m.set(t._id, t));
    return m;
  }, [teachers]);
  // === Modal logic ===
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    // Prefill branch with current selection when creating
    form.setFieldsValue({ branch: branchId });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
  };

  useEffect(() => {
    if (open && editing) {
      form.setFieldsValue({
        title: editing.title,
        grade: editing.grade,
        teacher: editing.teacher?._id || null,
        branch: branchId || "",
      });
    } else {
      form.resetFields();
    }
  }, [open, editing, form, branchId]);

  // === Save class ===
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title.trim(),
        grade: values.grade,
        teacher: values.teacher,
        branch: values.branch || branchId, // ✅ всегда выбран филиал
      };

      if (editing) await onUpdate?.(editing._id, payload);
      else await onAdd?.(payload);

      setOpen(false);
      setEditing(null);
      form.resetFields();
    } catch {
      // ignore
    }
  };

  // === Delete class ===
  const handleDelete = async (id) => {
    await onDelete?.(id, branchId);
  };

  // === Columns ===
  const columns = [
    {
      title: t("classesSettings.columns.name", "Sinf nomi"),
      dataIndex: "title",
      key: "title",
      width: 280,
    },
    {
      title: t("classesSettings.columns.grade", "Sinf"),
      dataIndex: "grade",
      key: "grade",
      width: 120,
      render: (g) => (g ? `${g}-sinf` : "-"),
    },
    {
      title: t("classesSettings.columns.teacher", "Rahbar o‘qituvchi"),
      dataIndex: "teacher",
      key: "teacher",
      render: (id) => {
        console.log(`teacherMap.get(id)`,id);
        return id ? `${id.firstName ?? ""} ${id.lastName ?? ""}`.trim() : "-";
      },
    },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {t("common.edit", "Tahrirlash")}
          </Button>
          <Popconfirm
            title={t("classesSettings.modal.deleteTitle", "Sinfni o‘chirish")}
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <TeamOutlined /> {t("classesSettings.title", "Sinflar")}
          </h2>

          {/* 🔹 Branch Select */}
          <Select
            value={branchId || undefined}
            onChange={(v) => setBranchId(v)}
            placeholder={t("classesSettings.selectBranch", "Filialni tanlang")}
            loading={bLoading}
            style={{ width: 220 }}
          >
            {branches.map((br) => (
              <Option key={br._id} value={br._id}>
                {br.title}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreate}
          disabled={!branchId}
        >
          {t("classesSettings.addBtn", "Sinf qo‘shish")}
        </Button>
      </div>

      {/* Errors */}
      {error && (
        <Alert
          type="error"
          message={t("classesSettings.error", "Xatolik")}
          description={String(error)}
          style={{ marginBottom: 12 }}
          showIcon
        />
      )}
      {tError && (
        <Alert
          type="warning"
          message={t("classesSettings.teacherLoadError", "O‘qituvchilarni yuklashda xatolik")}
          description={String(tError)}
          style={{ marginBottom: 12 }}
          showIcon
        />
      )}

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={classes}
        loading={loading}
        locale={{
          emptyText: <Empty description={t("classesSettings.empty", "Hali sinflar yo‘q")} />,
        }}
        pagination={{ pageSize: 8 }}
      />

      {/* Modal */}
      <Modal
        open={open}
        destroyOnClose
        title={
          editing
            ? t("classesSettings.modal.editTitle", "Sinfni tahrirlash")
            : t("classesSettings.modal.createTitle", "Yangi sinf qo‘shish")
        }
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        okText={editing ? t("common.save", "Saqlash") : t("common.create", "Qo‘шиш")}
        cancelText={t("common.cancel", "Bekor qilish")}
        confirmLoading={tLoading}
      >
        <Form form={form} layout="vertical" preserve={false}>
          {/* Sinf nomi */}
          <Form.Item
            label={t("classesSettings.modal.labels.name", "Sinf nomi")}
            name="title"
            rules={[
              { required: true, message: t("validation.required", "Majburий mayдон") },
              { max: 100, message: t("validation.max", "Juda uzun (100)") },
            ]}
          >
            <Input placeholder={t("classesSettings.modal.placeholders.name", "A")} />
          </Form.Item>

          {/* Sinf raqami */}
          <Form.Item
            label={t("classesSettings.modal.labels.grade", "Sinf raqami")}
            name="grade"
            rules={[{ required: true, message: t("validation.required", "Majburий mayдон") }]}
          >
            <Select placeholder={t("classesSettings.modal.placeholders.grade", "Sinfni tanlang")}>
              {Array.from({ length: 11 }, (_, i) => i + 1).map((g) => (
                <Option key={g} value={g}>
                  {g}-sinf
                </Option>
              ))}
            </Select>
          </Form.Item>


          {/* O‘qituvchi */}
          <Form.Item
            label={t("classesSettings.modal.labels.teacher", "Rahbar o‘qituvchi")}
            name="teacher"
            rules={[{ required: true, message: t("validation.required", "Majburий mayдон") }]}
          >
            <Select
              placeholder={t("classesSettings.modal.placeholders.teacher", "O‘qituvchini tanlang")}
              loading={tLoading}
              showSearch
              optionFilterProp="children"
              onDropdownVisibleChange={(o) => {
                if (o && teachers.length === 0 && !tLoading) dispatch(fetchTeachers());
              }}
            >
              {teachers.map((t) => (
                <Option key={t._id} value={t._id}>
                  {`${t.firstName ?? ""} ${t.lastName ?? ""}`.trim()}{" "}
                  {t.email ? `(${t.email})` : ""}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassesSettings;