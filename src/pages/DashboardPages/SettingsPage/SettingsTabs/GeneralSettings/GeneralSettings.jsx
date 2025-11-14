import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Button,
  Typography,
  Upload,
  Space,
  Card,
  Row,
  Col,
  InputNumber,
  notification,
  Switch,
} from "antd";
import { UndoOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useThemeMode } from "../../../../../hooks/useThemeMode";
import {
  fetchCurrency,
  updateCurrency,
} from "../../../../../App/Api/currency/currencySlice";
import {
  fetchTuitionDay,
  updateTuitionDay,
} from "../../../../../App/Api/tuitionDay/tuitionDaySlice";
import stylesd from "./GeneralSettings.module.scss";
import Loader from "../../../../../Components/UI/Loader/Loader";

const { Title, Text } = Typography;

const CustomLabel = ({ title, extraText }) => (
  <div
    className={stylesd.textlabel}
    style={{ display: "flex", flexDirection: "column", width: "100%" }}
  >
    <Text strong>{title}</Text>
    {extraText && (
      <Text
        type="secondary"
        style={{ fontSize: 12, lineHeight: "18px", wordBreak: "break-word" }}
      >
        {extraText}
      </Text>
    )}
  </div>
);

const ThemeModeField = () => {
  const { mode, toggle } = useThemeMode();
  return (
    <Form.Item
      label={
        <CustomLabel
          title="Tizim mavzusi"
          extraText="Yorug' yoki tungi rejimni tanlang. Tanlovingiz saqlanadi."
        />
      }
      colon={false}
    >
      <Space>
        <Switch
          checked={mode === "dark"}
          onChange={toggle}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <Text type="secondary">{mode === "dark" ? "Tungi rejim" : "Yorug' rejim"}</Text>
      </Space>
    </Form.Item>
  );
};

const SettingsPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { rate, loading } = useSelector((state) => state.currency);
  const { day } = useSelector((state) => state.tuition);
  const [fileList, setFileList] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    dispatch(fetchCurrency());
    dispatch(fetchTuitionDay());
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      currencyRate: rate || 0,
      paymentDay: Number(day) || 1,
      language: "uz",
    });
  }, [rate, day, form]);

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      icon:
        type === "success" ? (
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        ) : undefined,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleFinish = async (values) => {
    try {
      // Valyuta kursini saqlash
      await dispatch(updateCurrency(Number(values.currencyRate))).unwrap();

      // To‘lov sanasini saqlash
      if (values.paymentDay) {
        await dispatch(updateTuitionDay({ day: values.paymentDay })).unwrap();
      }

      // Notification
      openNotification(
        "success",
        "Sozlamalar muvaffaqiyatli saqlandi!",
        "Valyuta kursi va to‘lov sanasi yangilandi."
      );
    } catch (error) {
      openNotification(
        "error",
        "Xatolik yuz berdi!",
        error?.message || "Sozlamalarni saqlashda muammo bo‘ldi."
      );
    }
  };

  const handleUploadChange = ({ fileList }) => setFileList(fileList.slice(-1));
  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  if (loading && !day) return <Loader />;
  return (
    <>
      <div style={{ padding: "24px 0" }}>
        {contextHolder}
        <Card
          style={{ borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: "32px 40px" }}>
            <Title
              level={3}
              style={{ margin: 0, fontWeight: 600, color: "var(--colors-text-text-primary-900)" }}
            >
              Umumiy sozlamalari
            </Title>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 32 }}
            >
              Platforma ko‘rinishi va boshqa sozlamalar.
            </Text>

            <Form
              form={form}
              layout="horizontal"
              onFinish={handleFinish}
              requiredMark={false}
              labelCol={{ span: 8, style: { textAlign: "left" } }}
              wrapperCol={{ span: 16 }}
              colon={false}
            >
              {/* Valyuta kursi */}
              <Form.Item
                label={
                  <CustomLabel
                    title="Valyuta kursi"
                    extraText="Platforma avtomatik so‘mga konvertatsiya qiladi."
                  />
                }
                name="currencyRate"
                rules={[
                  { required: true, message: "Valyuta kursini kiriting" },
                ]}
              >
                <Space align="baseline">
                  <Form.Item name="currencyRate" noStyle>
                    <InputNumber
                      style={{ width: 120 }}
                      min={0}
                      formatter={(value) => {
                        if (!value && value !== 0) return "";
                        const num = Number(value.toString().replace(/\s/g, ""));
                        if (isNaN(num)) return "";
                        const parts = num.toString().split(".");
                        parts[0] = parts[0].replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          " "
                        );
                        return parts.join(".");
                      }}
                      parser={(value) => value.replace(/\s/g, "")}
                    />
                  </Form.Item>
                  <Text strong style={{ color: "var(--colors-text-text-secondary-700)" }}>
                    UZS = 1 USD
                  </Text>
                </Space>
              </Form.Item>

              {/* To‘lov sanasi */}
              <Form.Item
                label={
                  <CustomLabel
                    title="To‘lov sanasi"
                    extraText="O‘quvchilardan to‘lov yechib olish sanasi"
                  />
                }
                name="paymentDay"
                rules={[{ required: true, message: "To‘lov sanasini tanlang" }]}
              >
                <Select
                  size="large"
                  placeholder="To‘lov sanasi"
                  style={{ width: 200 }}
                  options={Array.from({ length: 31 }, (_, i) => ({
                    label: `${i + 1}-sanada`,
                    value: i + 1,
                  }))}
                />
              </Form.Item>

              {/* Logo */}
              <Form.Item
                label={
                  <CustomLabel title="Logo" extraText="Platformani logosi" />
                }
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                {fileList.length > 0 ? (
                  <img
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="logo"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    showUploadList={false}
                  >
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        border: "2px dashed var(--colors-border-border-secondary)",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "var(--colors-background-bg-secondary-alt)",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background:
                            "linear-gradient(135deg, #d8b4fe 0%, #a78bfa 100%)",
                          borderRadius: "50%",
                          marginBottom: 8,
                        }}
                      />
                      <Text
                        style={{
                          color: "var(--colors-text-text-brand-secondary-700)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        Logo yuklash
                      </Text>
                    </div>
                  </Upload>
                )}
              </Form.Item>

              {/* Til */}
              <Form.Item
                label={<CustomLabel title="Til" extraText="Platforma tili." />}
                name="language"
              >
                <Select
                  size="large"
                  style={{ width: 200 }}
                  options={[
                    { value: "uz", label: "🇺🇿 Uzbek" },
                    { value: "ru", label: "🇷🇺 Русский" },
                    { value: "en", label: "🇺🇸 English" },
                  ]}
                />
              </Form.Item>

              {/* Tema rejimi */}
              <ThemeModeField />

              {/* Tugmalar */}
              <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: 24 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Button
                      icon={<UndoOutlined />}
                      style={{
                        borderRadius: 8,
                        height: 40,
                        fontWeight: 500,
                        color: "var(--colors-text-text-brand-secondary-700)",
                        borderColor: "var(--colors-brand-600)",
                      }}
                    >
                      Boshlang‘ich holatga qaytarish
                    </Button>
                  </Col>
                  <Col>
                    <Space size={12}>
                      <Button
                        onClick={() => form.resetFields()}
                        style={{
                          borderRadius: 8,
                          height: 40,
                          fontWeight: 500,
                          padding: "0 16px",
                        }}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{
                          borderRadius: 8,
                          height: 40,
                          fontWeight: 500,
                          padding: "0 24px",
                          background: "var(--colors-brand-600)",
                          border: "none",
                        }}
                      >
                        Saqlash
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};
export default SettingsPage;
