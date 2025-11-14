import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./CreateTeacher.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import { createTeacher } from "../../../../App/Api/Teachers/teachersSlice";
import { fetchRoles } from "../../../../App/Api/Roles/rolesSlice";
import { fetchBranches } from "../../../../App/Api/Branches/branchesSlice";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Row, Col, Select, message } from "antd";
import { InputNumber } from "antd";
const CreateTeacher = ({ onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const branchId = localStorage.getItem("branchId");
  // 🔹 Redux states
  
  const {
    list: roles,
    loading: rolesLoading,
    error: rolesError,
  } = useSelector((state) => state.roles);
  const { list: branches, loading: branchLoading } = useSelector(
    (state) => state.branches
  );

  // 🔹 Load roles & branches
  useEffect(() => {
    if (!roles.length) dispatch(fetchRoles());
    if (!branches.length) dispatch(fetchBranches({ page: 1, limit: 100 }));
  }, [dispatch, roles.length, branches.length]);
  
  // 📤 Submit handler
  
  useEffect(() => {
    if (branches.length && branchId) {
      const exists = branches.find((b) => b._id === branchId);
      if (exists) {
        setSelectedBranch(branchId);
        form.setFieldsValue({ branch: branchId }); // 🔹 Form bilan sinxronlash
      }
    }
  }, [branches, branchId, form]);
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        firstName: values.firstName?.trim() || "",
        lastName: values.lastName?.trim() || "",
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        extraPhone: values.extraPhone
          ? `+998${values.extraPhone.replace(/\D/g, "").slice(-9)}`
          : "",
        role: values.role || "",
        salary: Number(values.salary) || 0,
        telegram: values.telegram?.trim() || "",
        bio: values.bio?.trim() || "",
        branch: values.branch || "", // ✅ Filial ID
      };

      await dispatch(createTeacher(payload)).unwrap();
      message.success("✅ Ustoz muvaffaqiyatli qo‘shildi!");
      navigate("/home/staff");
    } catch (err) {
      console.error("❌ Server error:", err);
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";
      message.error(`❌ ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const controlStyle = {
    height: 44,
    borderRadius: 8,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    lineHeight: "22px", // matn vertikal markazlashish uchun
    padding: "0 12px", // chap va o‘ng padding
    width: "100%", // inputni to‘liq kenglikka chiqarish
    boxSizing: "border-box",

    padding: "0 12px", // chap va o‘ng paddin
    lineHeight: "44px",
  };
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
        <Breadcrumbs extraLabel={t("createTeacher.breadcrumb")} />
      </div>

      <div className={styles.topBox}>
        {/* Chap tomoni */}
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>{t("createTeacher.title")}</h3>
          <p className={styles.sectionSubtitleTop}>
            {t("createTeacher.subtitle")}
          </p>
        </div>

        {/* O‘ng tomoni */}
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
                  <Input placeholder="Olivia" style={controlStyle} />
                </Form.Item>
              </Col>

              {/* === Familiya === */}
              <Col span={12}>
                <Form.Item
                  label="Familiya"
                  name="lastName"
                  rules={[{ required: true, message: "Familiya kiriting" }]}
                >
                  <Input placeholder="Rhye" style={controlStyle} />
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
                      message: "9 xonali raqamni kiriting ",
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
                      message: "9 xonali raqamni kiriting ",
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
                      option?.children
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    value={selectedBranch} // state bilan bog‘langan
                    onChange={(val) => {
                      setSelectedBranch(val); // state yangilanadi
                      form.setFieldsValue({ branch: val }); // Form value yangilanadi
                    }}
                  >
                    {branches.length ? (
                      branches.map((b) => (
                        <Select.Option key={b._id} value={b._id}>
                          {b.title}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>Topilmadi</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>

              {/* === Xodim roli (API dan) === */}
              <Col span={12}>
                <Form.Item
                  label="Xodim roli"
                  name="role"
                  rules={[{ required: true, message: "Xodim rolini tanlang" }]}
                >
                  <Select
                    placeholder="Rolni tanlang"
                    loading={rolesLoading}
                    style={{
                      ...controlStyle,
                      padding: 0,
                    }}
                  >
                    {roles.map((role) => (
                      <Select.Option key={role._id} value={role._id}>
                        {role.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* === Oylik === */}
              <Col span={12}>
                <Form.Item label="Oylik" name="salary">
                  <InputNumber
                    placeholder="5000000"
                    style={controlStyle} // dizayn bir xil bo‘lsin
                    min={0}
                    formatter={(value) => {
                      if (!value && value !== 0) return "";
                      const parts = value.toString().split(".");
                      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); // har 3 xonada ajratish
                      return parts.join(".");
                    }}
                    parser={(value) => value.replace(/\s/g, "")} // bo‘shliqni olib tashlash
                    onKeyDown={(e) => {
                      // faqat raqam va kerakli tugmalarni qabul qilish
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              {/* === Telegram === */}
              <Col span={24}>
                <Form.Item label="Telegram" name="telegram">
                  <Input
                    placeholder="@username"
                    style={controlStyle}
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
                      fontSize: 15,
                      fontFamily: "Inter, sans-serif",
                      padding: "10px 14px",
                      lineHeight: "22px",
                      resize: "none",
                      background: "var(--colors-background-bg-primary)",
                      color: "var(--colors-text-text-primary-900)",
                      borderColor: "var(--colors-border-border-secondary)",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* === Tugmalar === */}
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
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  background: "var(--colors-background-bg-brand-solid)",
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

export default CreateTeacher;
