// src/pages/DashboardPages/StudentsPage/StudentsTable/StudentsTable.jsx
import React, { useState } from "react";
import { Table, Avatar, Button, Tooltip, Space, Modal, Tag } from "antd";
import { FiTrash2, FiEdit2, FiPhone, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import { useEffect } from "react";

const StudentsTable = ({
  students = [],
  loading,
  error,
  onRowClick,
  onDelete,
  navigate,
  onEdit,
}) => {
  const { t } = useTranslation();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleEdit = (id) => navigate(`/home/students/${id}/edit`);
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget._id);
      setDeleteTarget(null);
    }
  };
  useEffect(() => {
    onEdit = (id) => {
      navigate(`/home/students/${id}/edit`);
    };
  }, []);

  const columns = [
    {
      title: t("studentsTable.name"),
      key: "name",
      render: (_, student) => (
        <Space
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => onRowClick(student._id)}
        >
          <Avatar
            src={student.avatar}
            icon={!student.avatar && <FiUser />}
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
              {student.firstName} {student.lastName}
            </div>
            {student.class?.title && (
              <Tag color="blue" style={{ marginTop: 2 }}>
                {student.class.title}
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: t("studentsTable.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone) =>
        phone ? (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "var(--colors-brand-600)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {phone}
          </a>
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>—</span>
        ),
    },
    {
      title: t("studentsTable.class"),
      key: "class",
      render: (_, student) =>
        student.class?.length > 0 ? (
          <span style={{ color: "var(--colors-text-text-secondary-700)" }}>
            {student.class.map((cls) => `${cls.grade}-${cls.title}`).join(", ")}
          </span>
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>—</span>
        ),
    },
    {
      title: t("studentsTable.salary", "Oylik to‘lov"),
      key: "salary",
      render: (_, student) =>
        student.salary != 0 ? (
          <span style={{ color: "var(--colors-text-text-secondary-700)" }}>
            {student.salary} UZS
          </span>
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>
            {student?.tariff?.title}
            <li> {student?.tariff?.tuition.toLocaleString("ru-RU")}</li>
          </span>
        ),
    },
    {
      title: t("studentsTable.balance", "Chegirma"),
      key: "discountAmount",
      render: (_, student) =>
        student.discountAmount ? (
          <span style={{ color: "var(--colors-text-text-secondary-700)" }}>
            {Number(student.discountAmount).toLocaleString("ru-RU")} UZS
          </span>
        ) : (
          <span style={{ color: "var(--colors-text-text-quaternary-500)" }}>—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      align: "center",
      render: (_, student) => (
        <Space size="middle">
          <Tooltip title={t("studentsTable.call")}>
            <Button
              type="text"
              icon={<FiPhone />}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${student.phone}`;
              }}
              style={{
                color: "var(--success-700)",
                fontSize: 16,
              }}
            />
          </Tooltip>

          <Tooltip title={t("studentsTable.edit")}>
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={() => onEdit(student._id)}
              style={{
                color: "var(--colors-brand-600)",
                fontSize: 16,
              }}
            />
          </Tooltip>

          <Tooltip title={t("studentsTable.delete")}>
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(student);
              }}
              style={{
                color: "var(--error-600)",
                fontSize: 16,
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error)
    return (
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          color: "red",
          fontWeight: 500,
        }}
      >
        ❌ {t("studentsTable.error")}: {error}
      </div>
    );

  return (
    <>
      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        locale={{
          emptyText: t("studentsTable.empty", "O‘quvchilar topilmadi"),
        }}
        onRow={(record) => ({
          style: {
            cursor: "pointer",
            transition: "background 0.2s",
          },
          onMouseEnter: (e) =>
            (e.currentTarget.style.background =
              "var(--colors-background-bg-secondary-alt)"),
          onMouseLeave: (e) =>
            (e.currentTarget.style.background = "transparent"),
        })}
        style={{
          background: "var(--colors-background-bg-primary)",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      />

      {/* 🗑️ Модалка подтверждения удаления */}
      <Modal
        open={!!deleteTarget}
        title={t("studentsTable.modal.deleteTitle", "O‘quvchini o‘chirish")}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        okText={t("studentsTable.modal.buttons.deleteConfirm", "O‘chirish")}
        cancelText={t(
          "studentsTable.modal.buttons.deleteCancel",
          "Bekor qilish"
        )}
        okButtonProps={{ danger: true }}
      >
        <p>
          {t("studentsTable.modal.deleteText", {
            name: `${deleteTarget?.firstName || ""} ${
              deleteTarget?.lastName || ""
            }`,
            defaultValue: `"${deleteTarget?.firstName || ""} ${
              deleteTarget?.lastName || ""
            }" o‘quvchisini o‘chirishni istaysizmi?`,
          })}
        </p>
      </Modal>
    </>
  );
};

export default StudentsTable;
