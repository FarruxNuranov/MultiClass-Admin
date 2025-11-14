import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./CreateParent.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import { FiUser } from "react-icons/fi";
import { createParent } from "../../../../App/Api/Parents/parentsSlice";
import { fetchBranches } from "../../../../App/Api/Branches/branchesSlice";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Row, Col, Select, message } from "antd";

const { Option } = Select;
const controlStyle = {
  height: 44,
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "Inter, sans-serif",
  lineHeight: "22px",
  alignItems: "center",
};
const CreateParent = ({ onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [selectedBranch, setSelectedBranch] = useState(null);
  const branchId = localStorage.getItem("branchId");
  const { list: branches = [], loading: branchLoading } = useSelector(
    (state) => state.branches
  );

  // 🔹 Загружаем филиалы при монтировании

  useEffect(() => {
    if (branches.length && branchId) {
      const exists = branches.find((b) => b._id === branchId);
      if (exists) {
        setSelectedBranch(branchId);
        form.setFieldsValue({ branch: branchId }); // 🔹 Form bilan sinxronlash
      }
    }
  }, [branches, branchId, form]);
  
  const formatPhone = (value) => {
    if (!value) return "";
    const nums = value.replace(/\D/g, "").slice(0, 9);
    const parts = [];
    if (nums.length > 0) parts.push(nums.slice(0, 3));
    if (nums.length > 3) parts.push(nums.slice(3, 5));
    if (nums.length > 5) parts.push(nums.slice(5, 7));
    if (nums.length > 7) parts.push(nums.slice(7, 9));
    return parts.join(" ");
  };

  // 📤 Сабмит родителя
  const handleSubmit = async (values) => {
    try {
      if (!selectedBranch) {
        message.warning("Avvalo filialni tanlang!");
        return;
      }

      // ✅ Формируем payload
      const payload = {
        firstName: values.firstName?.trim() || "",
        lastName: values.lastName?.trim() || "",
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        extraPhone: values.extraPhone
          ? `+998${values.extraPhone.replace(/\D/g, "").slice(-9)}`
          : "",
        telegram: values.telegram?.trim() || "",
        bio: values.bio?.trim() || "",
        branch: selectedBranch, // ✅ филиал добавлен сюда
      };

      await dispatch(createParent(payload)).unwrap();

      message.success("✅ Ota-ona muvaffaqiyatli yaratildi!");
      navigate("/home/parents");
    } catch (err) {
      console.error("❌ Server error:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";

      message.error(`❌ ${backendMessage}`);
    }
  };

  return (
    <div className={styles.editWrapper}>
      <div className={styles.headers}>
        <Breadcrumbs extraLabel={t("createParent.breadcrumb")} />
      </div>

      <div className={styles.topBox}>
        {/* Левая часть */}
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>{t("createParent.title")}</h3>
          <p className={styles.sectionSubtitleTop}>
            {t("createParent.subtitle")}
          </p>
        </div>

        {/* Правая часть */}
        <div className={styles.rightBoxTop}>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              {/* === Ism === */}
              <Col span={12}>
                <Form.Item
                  label="Ism"
                  name="firstName"
                  rules={[{ required: true, message: "Ism kiriting" }]}
                >
                  <Input style={{ ...controlStyle }} placeholder="Olivia" />
                </Form.Item>
              </Col>

              {/* === Familiya === */}
              <Col span={12}>
                <Form.Item
                  label="Familiya"
                  name="lastName"
                  rules={[{ required: true, message: "Familiya kiriting" }]}
                >
                  <Input placeholder="Rhye" style={{ ...controlStyle }} />
                </Form.Item>
              </Col>

              {/* === Telefon === */}
              <Col span={12}>
                <Form.Item
                  label="Telefon"
                  name="phone"
                  rules={[
                    { required: true, message: "Telefon raqamini kiriting" },
                    {
                      pattern: /^\d{9}$/,
                      message: "9 xonali raqamni kiriting (901234567)",
                    },
                  ]}
                >
                  <Input
                    type="tel"
                    maxLength={9} // bo‘sh joylar bilan formatlash
                    style={{ ...controlStyle }}
                    prefix={<span style={{ userSelect: "none" }}>+998 </span>}
                    value={formatPhone(form.getFieldValue("phone"))}
                    onChange={(e) => {
                      // faqat raqam, maksimal 9 ta
                      const onlyNums = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9);
                      form.setFieldValue("phone", onlyNums);
                    }}
                  />
                </Form.Item>
              </Col>

              {/* === Qo‘shimcha telefon === */}
              <Col span={12}>
                <Form.Item
                  label="Qo‘shimcha telefon"
                  name="extraPhone"
                  rules={[
                    {
                      pattern: /^\d{9}$/,
                      message: "9 xonali raqamni kiriting (911234567)",
                    },
                  ]}
                >
                  <Input
                    type="tel"
                    maxLength={9} // bo‘sh joylar bilan formatlash
                    style={{ ...controlStyle }}
                    prefix={<span style={{ userSelect: "none" }}>+998 </span>}
                    value={formatPhone(form.getFieldValue("phone"))}
                    onChange={(e) => {
                      // faqat raqam, maksimal 9 ta
                      const onlyNums = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9);
                      form.setFieldValue("extraPhone", onlyNums);
                    }}
                  />
                </Form.Item>
              </Col>

              {/* === Filial === */}
              <Col span={12}>
                <Form.Item
                  label="Filial"
                  name="branch"
                  rules={[{ required: true, message: "Filialni tanlang" }]}
                >
                 <Select
      placeholder="Filialni tanlang"
      loading={branchLoading}
      style={{ ...controlStyle, padding: 0 }}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
      }
      value={selectedBranch} // state bilan bog‘langan
      onChange={(val) => {
        setSelectedBranch(val);       // state yangilanadi
        form.setFieldsValue({ branch: val }); // Form value yangilanadi
      }}
    >
      {branches.length
        ? branches.map((b) => (
            <Select.Option key={b._id} value={b._id}>
              {b.title}
            </Select.Option>
          ))
        : <Select.Option disabled>Topilmadi</Select.Option>}
    </Select>
                </Form.Item>
              </Col>

              {/* === Telegram === */}
              <Col span={12}>
                <Form.Item label="Telegram" name="telegram">
                  <Input
                    style={{ ...controlStyle }}
                    placeholder="@username"
                    onBlur={(e) => {
                      if (e.target.value && !e.target.value.startsWith("@")) {
                        form.setFieldsValue({
                          telegram: "@" + e.target.value,
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              {/* === Izoh === */}
              <Col span={24}>
                <Form.Item label="Izoh" name="bio">
                  <Input.TextArea
                    rows={4}
                    placeholder="O‘zingiz haqida qisqacha yozing..."
                    maxLength={275}
                    style={{
                      borderRadius: 8,
                      resize: "none",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* === Кнопки === */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                borderTop: "1px solid var(--colors-border-border-secondary)",
                paddingTop: 16,
              }}
            >
              <Button
                onClick={onBack}
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600,
                  background: "var(--colors-brand-600)",
                  padding: "0 28px",
                }}
              >
                Saqlash
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateParent;
