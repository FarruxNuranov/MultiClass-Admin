import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./CreateStudent.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import { LuUpload } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/uz";
import {
  InputNumber,
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
} from "antd";
import { useTranslation } from "react-i18next";

import { createStudent } from "../../../../App/Api/Students/studentsSlice";
import { fetchClasses } from "../../../../App/Api/Classes/classesSlice";
import {
  fetchParents,
  createParent,
} from "../../../../App/Api/Parents/parentsSlice";
import { fetchBranches } from "../../../../App/Api/Branches/branchesSlice";
import { fetchTariffs } from "../../../../App/Api/Tariffs/tariffsSlice";
import { BackgroundColor, Color } from "@tiptap/extension-text-style";

const controlStyle = {
  height: 44,
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "Inter, sans-serif",
  lineHeight: "22px",
  alignItems: "center",
};

const NumericInput = ({ ...props }) => (
  <InputNumber
    {...props}
    style={{ width: "100%" }}
    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
    parser={(v) => v.replace(/\s?/g, "")}
    onKeyDown={(e) => {
      if (
        !/[0-9]/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      )
        e.preventDefault();
    }}
  />
);

const CreateStudent = ({ onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [parentForm] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [parentModalVisible, setParentModalVisible] = useState(false);
  const [creatingParent, setCreatingParent] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const branchId = localStorage.getItem("branchId");
  const { list: branches = [], loading: branchLoading } = useSelector(
    (s) => s.branches
  );
  const { items: classes = [], loading: classLoading } = useSelector(
    (s) => s.classes
  );
  const { list: parents = [], loading: parentsLoading } = useSelector(
    (s) => s.parents
  );

  const { list: tariffs = [], loading: tariffsLoading } = useSelector(
    (s) => s.tariff
  );
  useEffect(() => {}, []);
  useEffect(() => {
    if (!classes.length) dispatch(fetchClasses());
    if (!parents.length) dispatch(fetchParents({ page: 1, limit: 100 }));
    if (!branches.length) dispatch(fetchBranches({ page: 1, limit: 100 }));
    if (!tariffs.length) dispatch(fetchTariffs());
  }, [
    dispatch,
    classes.length,
    parents.length,
    branches.length,
    tariffs.length,
  ]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

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
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        passportId: values.passportId?.trim() || "",
        class: values.class,
        parent: values.parent,
        branch: values.branch,
        bio: values.bio?.trim() || "",
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : null,
        monthlyPayment: values.monthlyPayment?.toString() || "0",
        balance: values.balance?.toString() || "0",
        tariff: values.tariff || "",
        discountAmount: values.discountAmount?.toString() || "0",
        avatar: avatar || null,
      };
      await dispatch(createStudent(payload)).unwrap();
      message.success("O‘quvchi muvaffaqiyatli qo‘shildi!");
      navigate("/home/students");
    } catch {
      message.error("Xatolik yuz berdi");
    }
  };

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

  const renderSelectOptions = (list, labelFn = (item) => item.title) =>
    list.length ? (
      list.map((i) => (
        <Select.Option key={i._id} value={i._id}>
          {labelFn(i)}
        </Select.Option>
      ))
    ) : (
      <Select.Option disabled>Topilmadi</Select.Option>
    );
  const StyledNumberInput = ({ allowNegative = true, ...props }) => (
    <InputNumber
      {...props}
      style={{
        ...controlStyle,
        width: "100%",
        textAlign: "center",
        height: 44,
        lineHeight: "44px",
      }}
      formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "")}
      parser={(v) => v?.replace(/\s/g, "")}
      onKeyDown={(e) => {
        const { value, selectionStart } = e.target;

        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];

        if (!allowNegative) {
          if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key))
            e.preventDefault();
          return;
        }
        if (e.key === "-") {
          if (selectionStart !== 0 || value.includes("-")) {
            e.preventDefault();
          }
          return;
        }
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key))
          e.preventDefault();
      }}
    />
  );
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
        <Breadcrumbs extraLabel={t("createStudent.breadcrumb")} />
      </div>

      <div className={styles.topBox}>
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>{t("createStudent.title")}</h3>
          <p className={styles.sectionSubtitleTop}>
            {t("createStudent.subtitle")}
          </p>
        </div>

        <div className={styles.rightBoxTop}>
          <div className={styles.avatarUploadBot}>
            {avatar ? (
              <img src={avatar} alt="avatar" className={styles.avatarBot} />
            ) : (
              <FiUser className={styles.avatarIconBot} />
            )}
            <div className={styles.uploadBoxBot}>
              <LuUpload size={24} className={styles.uploadIcon} />
              <label htmlFor="avatarUpload" className={styles.uploadButton}>
                {t("createStudent.upload.button")}
              </label>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarUpload}
                hidden
              />
              <p>{t("createStudent.upload.hint")}</p>
            </div>
          </div>

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
                  label="Sinf"
                  name="class"
                  rules={[{ required: true, message: "Sinf tanlang" }]}
                >
                  <Select
                    placeholder="Sinfni tanlang"
                    loading={classLoading}
                    style={{ ...controlStyle, padding: 0 }}
                  >
                    {renderSelectOptions(
                      classes,
                      (cls) => `${cls.grade} ${cls.title || ""}`
                    )}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Telefon raqami"
                  rules={[
                    { required: true, message: "Telefon raqamini kiriting" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const nums = value.replace(/\D/g, ""); // faqat raqamlarni olish
                        if (nums.length !== 9)
                          return Promise.reject(
                            new Error("Faqat 9 ta raqam kiriting")
                          );
                        return Promise.resolve();
                      },
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

              <Col span={24}>
                <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 15 }}>
                  To‘lov ma’lumotlari
                </div>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="tariff"
                      label="Tariff"
                      rules={[{ required: true, message: "Tariffni tanlang" }]}
                    >
                      <Select
                        style={{ ...controlStyle }}
                        placeholder="Tariffni tanlang"
                        loading={tariffsLoading}
                      >
                        {renderSelectOptions(tariffs)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="discountAmount" label="Chegirma">
                      <StyledNumberInput placeholder="Chegirma" min={0} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="balance"
                      label="Balans"
                      rules={[{ required: true, message: "Balansni kiriting" }]}
                    >
                      <StyledNumberInput
                        placeholder="Balans"
                        min={-999999999} // ixtiyoriy, past chegarani belgilash uchun
                        onKeyDown={(e) => {
                          // faqat balansda minus belgisiga ruxsat beramiz
                          if (
                            !/[0-9-]/.test(e.key) &&
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
                </Row>
              </Col>

              <Col span={24}>
                <Form.Item label="Ota-onasi" required>
                  <Space.Compact style={{ width: "100%" }}>
                    <Form.Item
                      name="parent"
                      noStyle
                      rules={[{ required: true, message: "Ota-onani tanlang" }]}
                    >
                      <Select
                        placeholder="Ota-ona tanlang"
                        loading={parentsLoading}
                        showSearch
                        optionFilterProp="children"
                        style={{ ...controlStyle, flex: 1, padding: 0 }}
                        filterOption={(input, option) => {
                          // option.children array bo'lsa uni stringga birlashtiramiz
                          const label = Array.isArray(option.children)
                            ? option.children.join(" ")
                            : option.children;
                          return label
                            .toLowerCase()
                            .includes(input.toLowerCase());
                        }}
                        allowClear
                      >
                        {parents.map((p) => (
                          <Select.Option key={p._id} value={p._id}>
                            {[p.firstName, p.lastName].join(" ")}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      onClick={() => setParentModalVisible(true)}
                      style={{
                        height: 44,
                        borderRadius: "0 8px 8px 0",
                        background: "#6841C6",
                        fontWeight: 500,
                        padding: "0 16px",
                      }}
                    >
                      Ota-ona qo‘shish
                    </Button>
                  </Space.Compact>
                </Form.Item>
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
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  background: "#6841C6",
                  padding: "0 28px",
                }}
              >
                Saqlash
              </Button>
            </div>
          </Form>
        </div>
      </div>

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
            <Input placeholder="Ismi" style={controlStyle} />
          </Form.Item>
          <Form.Item
            label="Familiya"
            name="lastName"
            rules={[{ required: true, message: "Familiya kiriting" }]}
          >
            <Input placeholder="Familiyasi" style={controlStyle} />
          </Form.Item>
          <Form.Item
            label="Telefon"
            name="phone"
            rules={[
              { required: true, message: "Telefon raqamini kiriting" },
              { pattern: /^\d{9}$/, message: "9 xonali raqamni kiriting" },
            ]}
          >
            <Input
              addonBefore="+998"
              maxLength={9}
              placeholder="90 123 45 67"
              style={controlStyle}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button
              onClick={() => {
                setParentModalVisible(false);
                parentForm.resetFields();
              }}
            >
              Bekor qilish
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingParent}
              style={{ background: "#6841C6" }}
            >
              Yaratish
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateStudent;
