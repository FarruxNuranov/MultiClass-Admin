import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  InputNumber,
} from "antd";
import { UserOutlined, DollarOutlined, CreditCardOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrency } from "../../../../../App/Api/currency/currencySlice";
import { fetchStudents } from "../../../../../App/Api/Students/studentsSlice";

const { Title, Text } = Typography;

const CreatePaymentModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  mode = "create",
  data,
  mask = true,
  defaultStudent,
  selectedStudent,
  setSelectedStudent, // parentga bildirish uchun
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { rate, loading: currencyLoading } = useSelector((state) => state.currency);
  const { list: students, loading: studentsLoading } = useSelector((state) => state.students);

  const [currency, setCurrency] = useState("UZS");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [transferSumm, setTransferSumm] = useState(0);
  const price = Form.useWatch("price", form);
  
  // 🔹 Modal ochilganda currency va students fetch
  useEffect(() => {
    if (open) {
      dispatch(fetchCurrency());
      dispatch(fetchStudents());
      setCurrency("UZS");
      form.setFieldsValue({ currency: "UZS", exchangeRate: 0 });
    }
  }, [open, dispatch, form]);

  // 🔹 Edit/view rejimida yoki defaultStudent/selectedStudent bilan form set qilish
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" || mode === "view") {
      if (data) {
        form.setFieldsValue({
          ...data,
          student: data.student?._id,
        });
        setCurrency(data.currency || "UZS");
      }
    } else if (selectedStudent?._id) {
      form.setFieldsValue({ student: selectedStudent._id });
    } else if (defaultStudent?._id) {
      form.setFieldsValue({ student: defaultStudent._id });
    }
  }, [open, data, defaultStudent, selectedStudent, mode, form]);

  // 🔹 Valyuta o‘zgarganda exchangeRate yangilash
  useEffect(() => {
    if (currency === "USD" && rate) {
      setExchangeRate(rate);
      form.setFieldsValue({ exchangeRate: rate });
    } else {
      setExchangeRate(0);
      form.setFieldsValue({ exchangeRate: 0 });
    }
  }, [currency, rate, form]);

  // 🔹 Submit handler
  const handleFinish = (values) => {
    const payload = {
      ...values,
      price: transferSumm,
      currency,
    };
    onSubmit?.(payload);
  };

useEffect(() => {
  if (currency === "USD" && price) {
    setTransferSumm(Number(price) * exchangeRate);
  } else {
    setTransferSumm(0);
  }
}, [price, currency, exchangeRate]);
  const studentOptions = students.map((s) => ({
    label: `${s.firstName} ${s.lastName}`,
    value: s._id,
  }));

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      closable
      mask={mask}
      title={null}
      styles={{
        content: {
          border: "none",
          boxShadow: "none",
          background: "var(--colors-background-bg-primary)",
        },
        body: { padding: "28px 32px 24px", borderRadius: 20, background: "var(--colors-background-bg-primary)" },
      }}
      style={{ borderRadius: 20, overflow: "hidden" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Header */}
        <Space align="center" size={12}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--colors-background-bg-brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "var(--colors-text-text-brand-secondary-700)",
            }}
          >
            <CreditCardOutlined />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            {t("paymentModal.createTitle")}
          </Title>
        </Space>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 20 }}
          requiredMark={false}
        >
          {/* Summa / Valyuta / Kurs */}
          <div style={{ display: "flex", gap: "12px" }}>
            <Form.Item
              label={t("paymentModal.amountLabel")}
              name="price"
              style={{ flex: "1" }}
              rules={[
                { required: true, message: t("paymentModal.amountRequired") },
              ]}
            >
              <InputNumber
                size="large"
                prefix={<DollarOutlined />}
                placeholder={t("paymentModal.amountPlaceholder")}
                min={0}
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

            <Form.Item
              label={t("paymentModal.currencyLabel")}
              name="currency"
              style={{ width: "25%" }}
              rules={[
                { required: true, message: t("paymentModal.currencyRequired") },
              ]}
            >
              <Select
                size="large"
                value={currency}
                onChange={setCurrency}
                options={[
                  { label: "UZS", value: "UZS" },
                  { label: "USD", value: "USD" },
                ]}
              />
            </Form.Item>

            {currency === "USD" && (
              <Form.Item
                label={t("paymentModal.exchangeLabel")}
                name="exchangeRate"
                style={{ width: "25%" }}
              >
                <Input
                  size="large"
                  type="number"
                  onChange={(e) => setExchangeRate(e.target.value)}
                  disabled={currencyLoading}
                />
              </Form.Item>
            )}
          </div>

          {/* ≈ hisoblangan so‘m */}
          {currency === "USD" && price && (
            <Text type="secondary" style={{ marginBottom: 20 }}>
              ≈ {transferSumm} so‘m
            </Text>
          )}

          {/* O‘quvchi */}
          <Form.Item
            label={t("paymentModal.studentLabel")}
            name="student"
            rules={[
              { required: true, message: t("paymentModal.studentRequired") },
            ]}
          >
            <Select
              size="large"
              placeholder={t("paymentModal.studentPlaceholder")}
              suffixIcon={<UserOutlined />}
              options={studentOptions}
              loading={studentsLoading}
              showSearch
              optionFilterProp="label"
              onChange={(val) => {
                // agar kerak bo‘lsa parentga bildirish
                selectedStudent && setSelectedStudent?.(val);
              }}
            />
          </Form.Item>

          {/* To‘lov turi */}
          <Form.Item
            label={t("paymentModal.paymentTypeLabel")}
            name="paymentType"
            rules={[
              {
                required: true,
                message: t("paymentModal.paymentTypeRequired"),
              },
            ]}
          >
            <Select
              size="large"
              placeholder={t("paymentModal.paymentTypePlaceholder")}
              options={[
                { label: "Naqd", value: "cash" },
                { label: "Bank", value: "bank" },
                { label: "Click", value: "click" },
                { label: "Uzum", value: "uzum" },
              ]}
            />
          </Form.Item>

          {/* ✅ Saqlash tugmasi */}
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              {mode === "edit"
                ? t("paymentModal.saveChanges", "O‘zgartirishni saqlash")
                : t("paymentModal.saveButton", "Saqlash")}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default CreatePaymentModal;
