// src/pages/CreateSchool/SchoolInfoCard/SchoolInfoCard.jsx
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Typography,
  Space,
  Card,
} from "antd";

const { Text } = Typography;
const { TextArea } = Input;

const SchoolInfoCard = ({ form }) => {
  const [charCount, setCharCount] = useState(0);

  // Edit holatda form initial value bilan counterni moslash
  useEffect(() => {
    const noteValue = form.getFieldValue("note") ;
    setCharCount(noteValue?.length);
  }, [form, form.getFieldValue("note")]);
  
  return (
    <Card title="Maktab ma'lumotlari" style={{ borderRadius: 12 }}>
      <Form.Item>
        <Text type="secondary">Ma'lumotlarni kiriting.</Text>
      </Form.Item>

      <Form.Item
        label="Nomi"
        name="name"
        rules={[{ required: true, message: "Maktab nomi kiritilishi shart" }]}
      >
        <Input placeholder="Maktab nomi" />
      </Form.Item>

      <Form.Item label="Tarif" style={{ marginBottom: 0 }}>
        <Space
          style={{ display: "flex", width: "100%" }}
          size="middle"
          align="start"
        >
          <Form.Item
            name="tariff"
            rules={[{ required: true, message: "Tarif tanlanishi shart" }]}
            style={{ marginBottom: 0, width: "100%" }}
          >
            <Select placeholder="Tarifni tanlang">
              <Select.Option value="basic">Basic</Select.Option>
              <Select.Option value="premium">Premium</Select.Option>
              <Select.Option value="vip">VIP</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            rules={[
              {
                type: "number",
                min: 0,
                max: 100,
                message: "0-100 orasida bo‘lishi kerak",
              },
            ]}
            style={{ width: "100%", marginBottom: 0 }}
          >
            <InputNumber
              placeholder="Chegirma (%)"
              min={0}
              max={100}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label="Izoh" name="note">
  <TextArea
    placeholder="Izoh yozing"
    rows={4}
    maxLength={500}
    onChange={(e) => setCharCount(e.target.value.length)}
  />
</Form.Item>
<Text type="secondary">{500 - charCount} ta belgi qoldi</Text>


    </Card>
  );
};

export default SchoolInfoCard;
