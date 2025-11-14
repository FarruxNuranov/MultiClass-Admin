// src/pages/DashboardPages/StaffPage/StaffTable/StaffTable.jsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Tooltip,
  Space,
  Tag,
  Modal,
} from "antd";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
 

const StaffTable = ({
  staff = [],
  loading,
  error,
  onRowClick,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();

  const [deleteTarget, setDeleteTarget] = useState(null);


  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      title: t("staffTable.columns.name"),
      key: "name",
      render: (_, item) => (
        <Space
          onClick={() => onRowClick(item._id)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--colors-text-text-primary-900)" }}>
              {item.firstName} {item.lastName}
            </div>
            <div style={{ color: "var(--colors-text-text-quaternary-500)", fontSize: 13 }}>
              {item.phone || t("staffTable.noPhone")}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: t("staffTable.columns.role"),
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role?.title === "admin"
              ? "red"
              : role?.title === "teacher"
              ? "blue"
              : role?.title === "Adminstrator"
              ? "green"
              : "default"
          }
          style={{ textTransform: "capitalize" }}
        >
          {role?.title || "—"}
        </Tag>
      ),
    },

    {
      title: t("staffTable.columns.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? (
          new Date(date).toLocaleDateString("uz-UZ")
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, item) => (
        <Space size="middle">
          <Tooltip title={t("staffTable.edit", "Tahrirlash")}>
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(item._id);
              }}
              style={{ color: "var(--colors-text-text-brand-secondary-700)", fontSize: 16 }}
            />
          </Tooltip>

          <Tooltip title={t("staffTable.delete", "O‘chirish")}>
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(item);
              }}
              style={{ color: "var(--colors-foreground-fg-error-primary)", fontSize: 16 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div
        style={{
          padding: 16,
          textAlign: "center",
          color: "var(--colors-foreground-fg-error-primary)",
          fontWeight: 500,
        }}
      >
        ❌ {t("staffTable.error")}: {error}
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={staff}
        loading={loading}
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        locale={{ emptyText: t("staffTable.notFound", "Xodimlar topilmadi") }}
        onRow={(record) => ({
          onClick: () => onRowClick(record._id),
          style: { cursor: "pointer", transition: "background 0.2s" },
          onMouseEnter: (e) => (e.currentTarget.style.background = "var(--colors-background-bg-secondary-alt)"),
          onMouseLeave: (e) =>
            (e.currentTarget.style.background = "transparent"),
        })}
        style={{
          background: "var(--colors-background-bg-primary)",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />

      <Modal
        open={!!deleteTarget}
        title={t("staffTable.modal.deleteTitle", "Xodimni o‘chirish")}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        okText={t("staffTable.modal.buttons.deleteConfirm", "O‘chirish")}
        cancelText={t("staffTable.modal.buttons.deleteCancel", "Bekor qilish")}
        okButtonProps={{ danger: true }}
      >
        <p>
          {t("staffTable.modal.deleteText", {
            name: `${deleteTarget?.firstName || ""} ${
              deleteTarget?.lastName || ""
            }`,
            defaultValue: `"${deleteTarget?.firstName || ""} ${
              deleteTarget?.lastName || ""
            }" xodimini o‘chirishni istaysizmi?`,
          })}
        </p>
      </Modal>
    </>
  );
};

export default StaffTable;
