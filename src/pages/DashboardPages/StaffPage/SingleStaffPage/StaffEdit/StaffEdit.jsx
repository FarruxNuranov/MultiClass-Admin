import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Row, Col, Select, message, Spin } from "antd";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import styles from "./StaffEdit.module.scss";
import { fetchRoles } from "../../../../../App/Api/Roles/rolesSlice";
import { fetchBranches } from "../../../../../App/Api/Branches/branchesSlice";
import {
  fetchTeacherById,
  updateTeacher,
} from "../../../../../App/Api/Teachers/teachersSlice";

const StaffEdit = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: staffId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const staff = useSelector((state) => state.employees.current);
  const { list: branches, loading: branchLoading } = useSelector(
    (state) => state.branches
  );
  // 🟣 Fetch roles
  useEffect(() => {
    const getRoles = async () => {
      try {
        if (!branches.length) dispatch(fetchBranches({ page: 1, limit: 100 }));
        const res = await dispatch(fetchRoles()).unwrap();
        setRoles(res.map((r) => ({ label: r.title, value: r._id })));
      } catch (err) {
        console.error("❌ Role fetch error:", err);
        message.error(t("staffEdit.roleFetchError"));
      }
    };
    getRoles();
  }, [dispatch, t, branches.length]);


  const handleChange = (branchId) => {
    setSelectedBranch(branchId);
    form.setFieldsValue({ branch: branchId });
  };

  // 🟣 Fetch staff by id
  useEffect(() => {
    if (!staffId) return;
    dispatch(fetchTeacherById(staffId))
      .unwrap()
      .catch((err) => {
        console.error("❌ Staff fetch error:", err);
        message.error(t("staffEdit.staffFetchError"));
      });
  }, [dispatch, staffId, t]);

  // 🟣 Prefill form
  useEffect(() => {
    if (staff) {
      form.setFieldsValue({
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        phone: staff.phone?.replace("+998", "") || "",
        extraPhone: staff.extraPhone?.replace("+998", "") || "",
        role: staff.role?._id || "",
        salary: staff.salary || "0",
        telegram: staff.telegram || "",
        bio: staff.bio || "",
        branch: staff.branch?.[0]?._id || null, // branch arraydan _id olindi
      });
      setSelectedBranch(staff.branch?.[0]?._id || null);
    }
  }, [staff, form]);
  

  const controlStyle = {
    height: 44,
    borderRadius: 8,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    lineHeight: "22px",
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        phone: values.phone
          ? `+998${values.phone.replace(/\D/g, "").slice(-9)}`
          : "",
        extraPhone: values.extraPhone
          ? `+998${values.extraPhone.replace(/\D/g, "").slice(-9)}`
          : "",
        role: values.role,
        salary: Number(values.salary) || 0,
        telegram: values.telegram?.trim(),
        bio: values.bio?.trim(),
        branch: values.branch,
      };

      await dispatch(updateTeacher({ id: staffId, data: payload })).unwrap();
      message.success(t("staffEdit.success"));
      navigate(-1);
    } catch (err) {
      console.error("❌ Update error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("staffEdit.errorDefault");
      message.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
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
  if (!staff)
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );

  return (
    <div className={styles.editWrapper}>
      <div className={styles.headers}>
        <Breadcrumbs extraLabel={t("staffEdit.breadcrumb")} />
      </div>

      <div className={styles.topBox}>
        <div className={styles.leftBoxTop}>
          <h3 className={styles.sectionTitleTop}>{t("staffEdit.top.title")}</h3>
          <p className={styles.sectionSubtitleTop}>
            {t("staffEdit.top.subtitle")}
          </p>
        </div>

        <div className={styles.rightBoxTop}>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.firstName")}
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: t("staffEdit.validation.firstName"),
                    },
                  ]}
                >
                  <Input placeholder="Olivia" style={controlStyle} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.lastName")}
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: t("staffEdit.validation.lastName"),
                    },
                  ]}
                >
                  <Input placeholder="Rhye" style={controlStyle} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.phone")}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: t("staffEdit.validation.phoneRequired"),
                    },
                    {
                      pattern: /^\d{9}$/,
                      message: t("staffEdit.validation.phonePattern"),
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
                      form.setFieldValue("Phone", onlyNums);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.extraPhone")}
                  name="extraPhone"
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

              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.role")}
                  name="role"
                  rules={[
                    { required: true, message: t("staffEdit.validation.role") },
                  ]}
                >
                  <Select
                    placeholder={t("staffEdit.labels.role")}
                    style={{ ...controlStyle, padding: 0 }}
                    options={roles}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label={t("staffEdit.labels.salary")} name="salary">
                  <Input
                    type="number"
                    placeholder="5000000"
                    style={controlStyle}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t("staffEdit.labels.telegram")}
                  name="telegram"
                >
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
              <Col span={12}>
                <Form.Item
                  label="Filial"
                  name="branch"
                  rules={[{ required: true, message: "Filialni tanlang" }]}
                >
                  <Select
                    placeholder="Filialni tanlang"
                    loading={branchLoading}
                    style={controlStyle}
                    showSearch
                    value={selectedBranch}
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    allowClear
                  >
                    {branches.map((b) => (
                      <Select.Option key={b._id} value={b._id}>
                        {b.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t("staffEdit.labels.bio")} name="bio">
                  <Input.TextArea
                    rows={4}
                    placeholder={t("staffEdit.placeholders.bio")}
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
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    color: "var(--colors-text-text-tertiary-600)",
                    marginTop: -8,
                    marginBottom: 12,
                  }}
                >
                  {t("staffEdit.charCount", {
                    count: 275 - (form.getFieldValue("bio")?.length || 0),
                  })}
                </div>
              </Col>
            </Row>

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
                onClick={() => navigate(-1)}
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {t("staffEdit.buttons.cancel")}
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
                {t("staffEdit.buttons.save")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default StaffEdit;
