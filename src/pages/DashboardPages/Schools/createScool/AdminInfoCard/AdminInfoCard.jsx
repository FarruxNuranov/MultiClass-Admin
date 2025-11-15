// src/pages/CreateSchool/AdminInfoCard.jsx
import React, { useState } from "react";
import { Form, Input, Select, Card, Row, Col } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";

const AdminInfoCard = ({ form, tenantId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { list } = useSelector((state) => state.roles);

  const roleOptions = list.map((role) => ({
    label: role.title,
    value: role._id,
  }));

  return (
    <Card title="Admin Ma'lumotlari" style={{ borderRadius: 12 }}>
      <p>Iltimos, quyidagi ma'lumotlarni to'liq kiriting</p>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ism"
            name="firstName"
            rules={[{ required: true, message: "Ism kiritilishi shart" }]}
          >
            <Input placeholder="Ismni kiriting" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Familya"
            name="lastName"
            rules={[{ required: true, message: "Familya kiritilishi shart" }]}
          >
            <Input placeholder="Familyani kiriting" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Parol"
            name="password"
            rules={[{ required: true, message: "Parol kiritilishi shart" }]}
          >
            <div style={{ position: "relative" }}>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Parolni kiriting"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 4,
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Roli"
            name="role"
            rules={[{ required: true, message: "Rolni tanlash shart" }]}
          >
            <Select
              placeholder="Rolni tanlang"
              options={
                roleOptions.length
                  ? roleOptions
                  : [{ label: "Yuklanmoqda...", value: "" }]
              }
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Telefon raqami"
            name="phone1"
            rules={[
              { required: true, message: "Telefon raqami kiritilishi shart" },
            ]}
          >
            <PhoneInput
              country={"uz"}
              inputProps={{ name: "phone1", required: true }}
              disableDropdown
              inputStyle={{ width: "100%", height: "42px", borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Qo'shimcha telefon raqami" name="phone2">
            <PhoneInput
              country={"uz"}
              inputProps={{ name: "phone2" }}
              disableDropdown
              inputStyle={{ width: "100%", height: "42px", borderRadius: "8px" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Telegram username" name="telegram">
            <Input placeholder="@username" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Izoh" name="adminNote">
            <Input.TextArea rows={4} placeholder="Qo'shimcha ma'lumot kiriting" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminInfoCard;
