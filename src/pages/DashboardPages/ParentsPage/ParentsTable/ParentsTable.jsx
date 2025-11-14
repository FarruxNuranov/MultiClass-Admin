// src/pages/DashboardPages/ParentsPage/ParentsTable/ParentsTable.jsx
import React from "react";
import { Table, Avatar, Button, Tooltip, Tag, Space } from "antd";
import { FiPhone, FiTrash2, FiEdit2, FiSend, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ParentsTable = ({ parents = [], loading, error, onRowClick, onDelete, navigate }) => {
  const { t } = useTranslation();

  const handleEdit = (id) => {
    navigate(`/home/parents/${id}/edit`);
  };

  const columns = [
    {
      title: t("parentsTable.name"),
      dataIndex: "name",
      key: "name",
      render: (_, parent) => (
        <Space
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => onRowClick(parent._id)}
        >
          <Avatar
            src={parent.avatar}
            icon={!parent.avatar && <FiUser />}
            size={42}
            style={{
              backgroundColor: "var(--colors-background-bg-secondary-alt)",
              color: "var(--colors-text-text-tertiary-600)",
            }}
          />
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 15,
                color: "var(--colors-text-text-primary-900)",
              }}
            >
              {parent.firstName} {parent.lastName}
            </div>
            
          </div>
        </Space>
      ),
    },
    {
      title: t("parentsTable.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <span style={{ color: "var(--colors-text-text-secondary-700)", fontWeight: 500 }}>
          {phone || "—"}
        </span>
      ),
    },
    {
      title: t("parentsTable.extraPhone"),
      dataIndex: "extraPhone",
      key: "extraPhone",
      render: (extraPhone) => (
        <span style={{ color: "var(--colors-text-text-tertiary-600)" }}>
          {extraPhone || "—"}
        </span>
      ),
    },
    {
      title: t("parentsTable.telegram"),
      dataIndex: "telegram",
      key: "telegram",
      render: (telegram) =>
        telegram ? (
          <a
            href={`https://t.me/${telegram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--colors-brand-600)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FiSend /> {telegram}
          </a>
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      align: "center",
      render: (_, parent) => (
        <Space size="middle">
          <Tooltip title={t("parentsTable.call")}>
            <Button
              type="text"
              icon={<FiPhone />}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${parent.phone}`;
              }}
              style={{ color: "var(--success-700)", fontSize: 16 }}
            />
          </Tooltip>

          <Tooltip title={t("parentsTable.edit")}>
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(parent._id);
              }}
              style={{ color: "var(--colors-brand-600)", fontSize: 16 }}
            />
          </Tooltip>

          <Tooltip title={t("parentsTable.delete")}>
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, parent._id);
              }}
              style={{ color: "var(--error-600)", fontSize: 16 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: "red", fontWeight: 500 }}>
        ❌ {t("parentsTable.error")}: {error}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={parents}
      loading={loading}
      rowKey="_id"
      pagination={{
        position: ["bottomCenter"],
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
      }}
      locale={{ emptyText: t("parentsTable.notFound") }}
      onRow={(record) => ({
        onClick: () => onRowClick(record._id),
        style: { cursor: "pointer", transition: "background 0.2s" },
        onMouseEnter: (e) =>
          (e.currentTarget.style.background =
            "var(--colors-background-bg-secondary-alt)"),
        onMouseLeave: (e) => (e.currentTarget.style.background = "transparent"),
      })}
      style={{
        background: "var(--colors-background-bg-primary)",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    />
  );
};

export default ParentsTable;
