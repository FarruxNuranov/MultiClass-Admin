import React, { useState } from "react";
import { Form, Button, Typography, message } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import styles from "./SelectRolePage.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../App/Api/Auth/authSlice";
import { ROLES } from "../../../config/roles";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const SelectRolePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  // default admin
  const { roles } = useSelector((s) => s.auth);
  // const roles = [
  //   { value: ROLES.ADMIN, label: t("role.admin"), icon: <SettingOutlined /> },
  //   { value: ROLES.TEACHER, label: t("role.teacher"), icon: <UserOutlined /> },
  // ];
  console.log(`roles`, roles);
  const phone = localStorage.getItem("phone");
  const password = localStorage.getItem("password");

  const onFinish = async () => {
    if (!selectedRole) return message.error(t("selectRole.chooseRole"));
    if (!phone || !password)
      return message.error(t("selectRole.phoneNotFound"));

    setLoading(true);
    try {
      const payload = {
        phone,
        password,
        role: selectedRole,
      };

      console.log("payload:", payload);

      const res = await dispatch(loginUser(payload)).unwrap();
      console.log("API javobi:", res);

      if (res?.requiresRoleSelection) {
        message.warning(t("selectRole.roleRequired"));
      } else if (res?.user && res?.token) {
        localStorage.removeItem("phone");
        localStorage.removeItem("password");
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        navigate("/home/dashboard");
      } else {
        message.error(res?.message || t("selectRole.loginError"));
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error(err?.message || t("selectRole.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.centerBox}>
        <div className={styles.formBox}>
          <Title level={2} className={styles.title}>
            {t("selectRole.title")}
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 25 }}>
            {t("selectRole.subtitle")}
          </Text>

          <Form name="select_role" layout="vertical" onFinish={onFinish}>
            <div className={styles.roleGroup}>
              {roles.map((role) => (
                <div
                  key={role.role._id}
                  className={`${styles.roleOption} ${
                    selectedRole === role.role._id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedRole(role.role._id)}
                >
                  <div className={styles.roleLeft}>
                    <span className={styles.roleTitle}>{role.role.title}</span>
                    {/* <span className={styles.roleName}>{role.name}</span> */}
                  </div>

                  <div className={styles.customCheckbox}>
                    {selectedRole === role.role._id && (
                      <CheckOutlined className={styles.tickIcon} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Form.Item>
              <Button
                className={styles.btnSubmit}
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {t("selectRole.loginBtn")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
