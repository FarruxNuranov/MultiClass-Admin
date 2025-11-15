// src/pages/DashboardPages/SchoolPage/SchoolTable/SchoolTable.jsx
import React, { useState } from "react";
import { Table, Button, Tooltip, Space, Tag, Modal } from "antd";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SchoolTable = ({
  schools = [],
  loading,
  error,
  onRowClick = (id) => {},
  onDelete = (id) => {
    console.log("Delete school with id:", id);
  },
  onEdit, // optional, we will navigate if not provided
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (id) => {
    
    if (onEdit) {
      onEdit(id);
    } else {
      // Default behavior: navigate to edit page
      navigate(`/home/schools/edit/${id}`);
    }
  };

  const columns = [
    {
      title: "Maktab nomi",
      dataIndex: "title",
      key: "title",
      render: (title, item) => (
        <div
          onClick={() => onRowClick(item._id)}
          style={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }}
        >
          {title}
        </div>
      ),
    },
    {
      title: "Izoh",
      dataIndex: "note",
      key: "note",
      render: (note) => <span style={{ color: "#666" }}>{note || "—"}</span>,
    },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "active" ? "green" : "red"}
          style={{ textTransform: "capitalize" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("uz-UZ") : <span style={{ color: "#aaa" }}>—</span>,
    },
    {
      title: "Amallar",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, item) => (
        <Space size="middle">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item._id);
              }}
              style={{ fontSize: 16 }}
            />
          </Tooltip>

          <Tooltip title="O‘chirish">
            <Button
              type="text"
              danger
              icon={<FiTrash2 />}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(item);
              }}
              style={{ fontSize: 16 }}
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
          color: "red",
          fontWeight: 500,
        }}
      >
        ❌ Xatolik: {error}
      </div>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={schools}
        loading={loading}
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
        }}
        locale={{ emptyText: "Maktablar topilmadi" }}
      />

      <Modal
        open={!!deleteTarget}
        title="Maktabni o‘chirish"
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        okText="O‘chirish"
        cancelText="Bekor qilish"
        okButtonProps={{ danger: true }}
      >
        <p>“{deleteTarget?.title}” maktabini o‘chirishni istaysizmi?</p>
      </Modal>
    </>
  );
};

export default SchoolTable;
