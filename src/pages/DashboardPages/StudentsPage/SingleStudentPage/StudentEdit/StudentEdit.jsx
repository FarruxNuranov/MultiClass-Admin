// src/pages/DashboardPages/StudentsPage/SingleStudentPage/StudentEdit/StudentEdit.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
  Modal,
  message,
  Spin,
  InputNumber,
} from "antd";
import { FiUser } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import styles from "./StudentEdit.module.scss";

import {
  updateStudent,
  fetchStudentById,
} from "../../../../../App/Api/Students/studentsSlice";
import { fetchClasses } from "../../../../../App/Api/Classes/classesSlice";
import {
  fetchParents,
  createParent,
} from "../../../../../App/Api/Parents/parentsSlice";
// Tariflar uchun to'g'ri import
import { fetchTariffs } from "../../../../../App/Api/Tariffs/tariffsSlice";
import { useNavigate, useParams } from "react-router-dom";

const StudentEdit = ({ onBackToInfo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [parentForm] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [parentModalVisible, setParentModalVisible] = useState(false);
  const [creatingParent, setCreatingParent] = useState(false);
  const { id } = useParams();

  const backpage = () => {
    navigate("/home/students");
  };

  // 🔹 Redux
  const { current: student, loading: studentLoading } = useSelector(
    (s) => s.students
  );
  const { items: classes = [], loading: classLoading } = useSelector(
    (s) => s.classes
  );
  const { list: parentsData, loading: parentsLoading } = useSelector(
    (s) => s.parents
  );
  // Tariflar ma'lumotlarini Redux'dan to'g'ri nom bilan olish (s.tariffs)
  const { list: tariffs = [], loading: tariffsLoading } = useSelector(
    (s) => s.tariff
  );

  // 🔹 Normalize parent list
  const parents = Array.isArray(parentsData)
    ? parentsData
    : parentsData
    ? [parentsData]
    : [];

  /* ----------------------------------------
    🟣 FETCH STUDENT DATA
  ---------------------------------------- */
  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id))
        .unwrap()
        .catch(() => {
          message.error("O‘quvchi ma’lumotlarini olishda xatolik");
        });
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  /* ----------------------------------------
    🟣 FETCH RELATED DATA (classes, parents, tariffs)
    dispatch ni bu yerda chaqirish to'g'ri (useEffect ichida)
  ---------------------------------------- */
  useEffect(() => {
    if (!classes?.length) {
      dispatch(fetchClasses());
    }
    dispatch(fetchParents({ page: 1, limit: 100 }));
    // Tariflarni yuklash funksiyasi
    dispatch(fetchTariffs({ page: 1, limit: 100 }));
  }, [dispatch, classes?.length]);

  /* ----------------------------------------
    🟣 Populate form when student loaded
  ---------------------------------------- */
  useEffect(() => {
    if (student?._id) {
      form.setFieldsValue({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        phone: student.phone?.replace("+998", "") || "",
        class: Array.isArray(student.class)
          ? student.class[0]?._id || student.class[0]
          : student.class?._id || "",
        parent: Array.isArray(student.parent)
          ? student.parent[0]?._id || student.parent[0]
          : student.parent?._id || "",
        // Tarif ID'sini yuklash
        tariff: student.tariff?._id || student.tariff || "",
        bio: student.bio || "",
        passportId: student.passportId || "",
        birthDate: student.birthDate ? dayjs(student.birthDate) : null,
        monthlyPayment: student.salary ? Number(student.salary) : 0,
        discountAmount: student.discountAmount
          ? Number(student.discountAmount)
          : 0,
        balance: student.balance ? Number(student.balance) : 0,
      });
      setAvatar(student.avatar || "");
    }
  }, [student, form]);

  /* ----------------------------------------
    📸 Avatar yuklash
  ---------------------------------------- */
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  /* ----------------------------------------
    📤 Studentni yangilash
  ---------------------------------------- */
  const handleSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        passportId: values.passportId?.trim() || "",
        class: values.class,
        parent: values.parent,
        bio: values.bio?.trim() || "",
        // Tariff maydoni payloadga qo'shildi
        tariff: values.tariff || undefined,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : null,
        salary: String(Number(values.monthlyPayment) || 0),
        discountAmount: String(Number(values.discountAmount) || 0),
        avatar: avatar || null,
      };

      // 'branch' ni ham qo'shamiz, agar mavjud bo'lsa
      if (student?.branch?.length) payload.branch = student.branch[0]._id;

      await dispatch(updateStudent({ id, data: payload })).unwrap();
      message.success("O‘quvchi ma’lumotlari yangilandi!");
      backpage()
    } catch (err) {
      console.error(err);
      message.error("Xatolik yuz berdi. Qayta urinib ko‘ring.");
    }
  };

  /* ----------------------------------------
    🧩 Ota-ona yaratish
  ---------------------------------------- */
  const handleCreateParent = async (values) => {
    try {
      setCreatingParent(true);
      const payload = {
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        phone: `+998${values.phone.replace(/\D/g, "").slice(-9)}`,
      };

      const newParent = await dispatch(createParent(payload)).unwrap();
      message.success("Ota-ona yaratildi!");
      setParentModalVisible(false);
      parentForm.resetFields();

      await dispatch(fetchParents({ page: 1, limit: 100 }));
      form.setFieldsValue({ parent: newParent._id });
    } catch {
      message.error("Ota-ona yaratishda xatolik yuz berdi");
    } finally {
      setCreatingParent(false);
    }
  };

  /* ----------------------------------------
    🎨 UI Config
  ---------------------------------------- */
  const controlStyle = {
    height: 44,
    borderRadius: 8,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    lineHeight: "22px",
  };

  // InputNumber uchun umumiy helper komponent
  const NumberInput = ({ label, name, required = true }) => (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required, message: `${label}ni kiriting` }]}
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
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} // 3 xonali guruhlash
        parser={(value) => value.replace(/\s?/g, "")} // backendga toza son yuborish
        onKeyPress={(e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault(); // faqat raqam kiritiladi
          }
        }}
      />
    </Form.Item>
  );

  /* ----------------------------------------
    🌀 Loader while fetching
  ---------------------------------------- */
  if (studentLoading && !student) {
    return (
      <div className={styles.loader}>
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

  /* ----------------------------------------
    ✅ Render
  ---------------------------------------- */
  return (
    <div className={styles.editWrapper}>
      <div className={styles.headers}>
        <Breadcrumbs extraLabel={t("studentEdit.breadcrumbsEdit")} />
      </div>

      <div className={styles.topBox}>
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>
            {t("studentEdit.personalTitle")}
          </h3>
          <p className={styles.sectionSubtitleTop}>
            {t("studentEdit.personalSubtitle")}
          </p>
        </div>

        <div className={styles.rightBoxTop}>
          {/* 📸 Avatar */}
          <div className={styles.avatarUploadBot}>
            {avatar ? (
              <img src={avatar} alt="avatar" className={styles.avatarBot} />
            ) : (
              <FiUser className={styles.avatarIconBot} />
            )}

            <div className={styles.uploadBoxBot}>
              <LuUpload size={24} className={styles.uploadIcon} />
              <label htmlFor="avatarUpload" className={styles.uploadButton}>
                {t("studentEdit.uploadBtn")}
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarUpload}
                hidden
              />
              <p>{t("studentEdit.uploadHint")}</p>
            </div>
          </div>

          {/* 📋 Form */}
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ism"
                  name="firstName"
                  rules={[{ required: true, message: "Ism kiriting" }]}
                >
                  <Input placeholder="Olivia" style={controlStyle} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Familiya"
                  name="lastName"
                  rules={[{ required: true, message: "Familiya kiriting" }]}
                >
                  <Input placeholder="Rhye" style={controlStyle} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Telefon"
                  name="phone"
                  rules={[
                    { required: true, message: "Telefon raqamini kiriting" },
                    {
                      pattern: /^\d{9}$/,
                      message: "9 xonali raqam kiriting (masalan: 901234567)",
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

              {/* === SINFLAR === */}
              <Col span={12}>
                <Form.Item
                  label="Sinf"
                  name="class"
                  rules={[{ required: true, message: "Sinf tanlang" }]}
                >
                  <Select
                    placeholder="Sinfni tanlang"
                    loading={classLoading}
                    style={{ ...controlStyle, padding: 0 }}
                  >
                    {classes.length > 0 ? (
                      classes.map((cls) => (
                        <Select.Option key={cls._id} value={cls._id}>
                          {cls.grade}
                          {cls.title ? ` ${cls.title}` : ""}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>Sinflar topilmadi</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>

              {/* === TARIFLAR (YANGI QO'SHILDI) === */}

              {/* === TUG'ILGAN SANA va PASSPORT ID === */}
              <Col span={12}>
                <Form.Item label="Tug‘ilgan sana" name="birthDate">
                  <DatePicker
                    style={{ ...controlStyle, width: "100%", padding: 10 }}
                    placeholder="DD.MM.YYYY"
                    format="DD.MM.YYYY"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Passport ID" name="passportId">
                  <Input placeholder="AB1234567" style={controlStyle} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tarif"
                  name="tariff"
                  rules={[{ required: true, message: "Tarif tanlang" }]}
                >
                  <Select
                    placeholder="Tarifni tanlang"
                    loading={tariffsLoading}
                    style={{ ...controlStyle, padding: 0 }}
                  >
                    {tariffs.length > 0 ? (
                      tariffs.map((t) => (
                        <Select.Option key={t._id} value={t._id}>
                          {t.title}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option disabled>Tariflar topilmadi</Select.Option>
                    )}
                  </Select>
                </Form.Item>
              </Col>


              {/* 3. CHEGIRMA (discountAmount) */}
              <Col span={12}>
                <NumberInput
                  label="Chegirma"
                  name="discountAmount"
                  required={false}
                  style={controlStyle}
                />
              </Col>

              {/* === OTA-ONA === */}
              <Col span={24}>
                <Form.Item label="Ota-onasi" required>
                  <Space.Compact style={{ width: "100%", display: "flex" }}>
                    <Form.Item
                      name="parent"
                      noStyle
                      rules={[{ required: true, message: "Ota-onani tanlang" }]}
                    >
                      <Select
                        placeholder="Ota-ona tanlang"
                        loading={parentsLoading}
                        style={{
                          ...controlStyle,
                          flex: 1,
                          borderRadius: "8px 0 0 8px",
                        }}
                      >
                        {parents.length > 0 ? (
                          parents.map((p) => (
                            <Select.Option key={p._id} value={p._id}>
                              {p.firstName} {p.lastName}
                            </Select.Option>
                          ))
                        ) : (
                          <Select.Option disabled>
                            Ota-ona topilmadi
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>

                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      style={{
                        height: 44,
                        borderRadius: "0 8px 8px 0",
                        fontWeight: 500,
                        background: "var(--colors-brand-600)",
                      }}
                      onClick={() => setParentModalVisible(true)}
                    >
                      Ota-ona qo‘shish
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>

              {/* === IZOH === */}
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
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 16,
              }}
            >
              <Button
                onClick={handleBack}
                style={{ height: 44, borderRadius: 8 }}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: 44,
                  borderRadius: 8,
                  background: "var(--colors-brand-600)",
                  padding: "0 28px",
                  fontWeight: 600,
                }}
              >
                Saqlash
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* 🟣 Ota-ona yaratish modal (o'zgarishsiz) */}
      <Modal
        title="Ota-ona yaratish"
        open={parentModalVisible}
        onCancel={() => setParentModalVisible(false)}
        footer={null}
        centered
      >
        <Form layout="vertical" form={parentForm} onFinish={handleCreateParent}>
          <Form.Item
            label="Ism"
            name="firstName"
            rules={[{ required: true, message: "Ism kiriting" }]}
          >
            <Input placeholder="Ismi" />
          </Form.Item>

          <Form.Item
            label="Familiya"
            name="lastName"
            rules={[{ required: true, message: "Familiya kiriting" }]}
          >
            <Input placeholder="Familiyasi" />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            
            rules={[
              { required: true, message: "Telefon raqamini kiriting" },
              {
                pattern: /^\d{9}$/,
                message: "9 xonali raqamni kiriting (masalan: 901234567)",
              },
            ]}
          >
            <Input
              addonBefore="+998"
              maxLength={9}
              placeholder="90 123 45 67"
              style={{
                height: 44,
                borderRadius: 8,
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
                ...controlStyle
              }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button onClick={() => setParentModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingParent}
              style={{ background: "var(--colors-brand-600)" }}
            >
              Yaratish
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentEdit;
