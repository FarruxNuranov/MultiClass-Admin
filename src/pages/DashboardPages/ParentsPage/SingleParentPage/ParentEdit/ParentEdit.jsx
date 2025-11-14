// src/pages/DashboardPages/ParentsPage/SingleParentPage/ParentEdit/ParentEdit.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { updateParent, fetchParentById } from "../../../../../App/Api/Parents/parentsSlice";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import { Form, Input, Button, Row, Col, message, Spin } from "antd";
import styles from "./ParentEdit.module.scss";
const controlStyle = {
  height: 44,
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "Inter, sans-serif",
  lineHeight: "22px",
  alignItems: "center",
};
const ParentEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // 🔹 Redux store’dan parentni olish
  const { current: parent, loading } = useSelector((state) => state.parents);

  // 🔹 Parentni APIdan fetch qilish
  useEffect(() => {
    if (id) dispatch(fetchParentById(id));
  }, [dispatch, id]);

  // 🔹 Formani store ma’lumotiga moslash
  useEffect(() => {
    if (parent) {
      form.setFieldsValue({
        firstName: parent.firstName || "",
        lastName: parent.lastName || "",
        phone: parent.phone?.replace("+998", "") || "",
        extraPhone: parent.extraPhone?.replace("+998", "") || "",
        telegram: parent.telegram || "",
        bio: parent.bio || "",
        email: parent.email || "",
      });
    }
  }, [parent, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        extraPhone: values.extraPhone
          ? `+998${values.extraPhone.replace(/\D/g, "").slice(-9)}`
          : "",
        telegram: values.telegram?.trim() || "",
        bio: values.bio?.trim() || "",
        email: values.email?.trim() || "",
      };

      await dispatch(updateParent({ id: parent._id, data: payload })).unwrap();
      message.success(t("parentEdit.alerts.success") || "Ma’lumot muvaffaqiyatli saqlandi");
      navigate("/home/parents");
    } catch (err) {
      console.error("❌ Update error:", err);
      message.error(t("parentEdit.alerts.error") || "Saqlashda xatolik yuz berdi");
    }
  };

  if (loading || !parent) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }
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
  return (
    <div className={styles.editWrapper}>
      <div className={styles.headers}>
        <Breadcrumbs extraLabel={t("parentEdit.breadcrumb") || "Parentni tahrirlash"} />
      </div>

      <div className={styles.topBox}>
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>{t("parentEdit.title") || "Parentni tahrirlash"}</h3>
          <p className={styles.sectionSubtitleTop}>
            {t("parentEdit.subtitle") || "Parent ma’lumotlarini yangilang"}
          </p>
        </div>

        <div className={styles.rightBoxTop}>
          <Form layout="vertical" form={form} onFinish={handleSubmit} autoComplete="off">
            <Row gutter={16}>
              {/* Ism */}
              <Col span={12}>
                <Form.Item label="Ism" name="firstName" rules={[{ required: true, message: "Ism kiriting" }]}>
                  <Input placeholder="Olivia" style={controlStyle} />
                </Form.Item>
              </Col>

              {/* Familiya */}
              <Col span={12}>
                <Form.Item label="Familiya" name="lastName" rules={[{ required: true, message: "Familiya kiriting" }]}>
                  <Input placeholder="Rhye" style={controlStyle} />
                </Form.Item>
              </Col>

              {/* Telefon */}
              <Col span={12}>
                <Form.Item
                  label="Telefon"
                  name="phone"
                  rules={[
                    { required: true, message: "Telefon raqamini kiriting" },
                    { pattern: /^\d{9}$/, message: "9 xonali raqam kiriting (901234567)" },
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

              {/* Qo‘shimcha telefon */}
              <Col span={12}>
                <Form.Item label="Qo‘shimcha telefon" name="extraPhone" rules={[
                    { required: true, message: "Telefon raqamini kiriting" },
                    { pattern: /^\d{9}$/, message: "9 xonali raqam kiriting (901234567)" },
                  ]}>
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

              {/* Telegram */}
              <Col span={24}>
                <Form.Item label="Telegram" name="telegram">
                  <Input
                    placeholder="@username"
                    style={controlStyle}
                    onBlur={(e) => {
                      if (e.target.value && !e.target.value.startsWith("@")) {
                        form.setFieldsValue({ telegram: "@" + e.target.value });
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col span={24}>
                <Form.Item label="Email" name="email">
                  <Input placeholder="example@mail.com" style={controlStyle} />
                </Form.Item>
              </Col>

              {/* Izoh */}
              <Col span={24}>
                <Form.Item label="Izoh" name="bio">
                  <Input.TextArea rows={4} maxLength={275} placeholder="O‘zingiz haqida qisqacha yozing..." />
                </Form.Item>
                <div style={{ textAlign: "right", fontSize: 12, color: "var(--colors-text-text-quaternary-500)", marginTop: -8, marginBottom: 12 }}>
                  {t("parentEdit.charLeft", { count: 275 - (form.getFieldValue("bio")?.length || 0) })}
                </div>
              </Col>
            </Row>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid var(--colors-border-border-secondary)", paddingTop: 16 }}>
              <Button onClick={() => navigate("/home/parents")} style={{ height: 44, borderRadius: 8, fontWeight: 600 }}>
                Bekor qilish
              </Button>
              <Button type="primary" htmlType="submit" style={{ height: 44, borderRadius: 8, fontWeight: 600, background: "var(--colors-brand-600)", padding: "0 28px" }}>
                Saqlash
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ParentEdit;
