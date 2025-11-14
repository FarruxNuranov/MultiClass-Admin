import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Tag,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTariffs,
  createTariff,
  updateTariff,
  deleteTariff,
} from "../../../../../App/Api/Tariffs/tariffsSlice";

const TariffsSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: tariffs, loading } = useSelector((state) => state.tariff);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  const [form] = Form.useForm();

  // 🔹 Tariffsni yuklash
  useEffect(() => {
    dispatch(fetchTariffs({ page: 1, limit: 20 }));
  }, [dispatch]);

  const showModal = () => {
    setEditingTariff(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingTariff(record);
    form.setFieldsValue({
      title: record.title,
      tuition: record.tuition,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteTariff(id));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingTariff) {
        dispatch(updateTariff({ id: editingTariff._id, data: values }));
      } else {
        dispatch(createTariff(values));
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Tarif nomi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "To‘lov summasi",
      dataIndex: "tuition",
      key: "tuition",
      render: (tuition) => `${Number(tuition).toLocaleString("uz-UZ")} so‘m`,
    },
    {
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {t("common.edit", "Tahrirlash")}
          </Button>
          <Popconfirm
            title="Tarifni o‘chirish"
            description={`"${record.title}" tarifni o‘chirishni istaysizmi?`}
            okText="O‘chirish"
            cancelText="Bekor qilish"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              {t("common.delete", "O‘chirish")}
             </Button>
          </Popconfirm>
        </Space>
       
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Tariflar</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          style={{
            backgroundColor: "var(--colors-brand-600)",
            borderRadius: 8,
          }}
        >
          Tarif qo‘shish
        </Button>
      </div>

      <Table
        dataSource={tariffs || []} // ✅ slice’dan kelgan list
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={false}
        style={{
          borderRadius: 12,
          overflow: "hidden",
        }}
      />

      <Modal
        title={editingTariff ? "Tarifni tahrirlash" : "Yangi tarif qo‘shish"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText="Saqlash"
        cancelText="Bekor qilish"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tarif nomi"
            name="title"
            rules={[{ required: true, message: "Tarif nomini kiriting" }]}
          >
            <Input placeholder="Masalan: VIP" />
          </Form.Item>
          <Form.Item
            label="To‘lov summasi (so‘m)"
            name="tuition"
            rules={[{ required: true, message: "Summani kiriting" }]}
          >
            <InputNumber
              min={0}
              placeholder="0"
              style={{
                width: "100%",
                height: 40,
                display: "flex",
                alignItems: "center",
              }}
              onWheel={(e) => e.target.blur()}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              } // 3 xonali guruhlash
              parser={(value) => value.replace(/\s?/g, "")} // backendga toza son yuborish
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault(); // faqat raqam kiritiladi
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TariffsSettings;
