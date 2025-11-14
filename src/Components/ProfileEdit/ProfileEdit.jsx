import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Button, Avatar, message, theme } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";


const ProfileEdit = ({
  editProfileOpen,
  setEditProfileOpen,
  changePasswordOpen,
  setChangePasswordOpen,
  user,
  onFetchProfile,
  onUpdateProfile,
  onChangePassword,
  profileUpdating = false,
}) => {
  const { token } = theme.useToken();



  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Load profile when modal opens
  useEffect(() => {
    if (editProfileOpen && !user && typeof onFetchProfile === "function") {
      onFetchProfile();
    }
    // Clear preview when closed
    if (!editProfileOpen) {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [editProfileOpen, user, onFetchProfile]);

  // Populate form when user data changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const avatarSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (user?.avatarUrl) return user.avatarUrl;
    if (user?.avatar) return user.avatar;
    return null;
  }, [previewUrl, user]);

  const handleAvatarSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const validateAndSelectFile = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }
    handleAvatarSelect(file);
    return true;
  };

  const handleEditProfile = async (values) => {
    try {
      if (typeof onUpdateProfile !== "function") {
        message.error("Update handler is not provided");
        return;
      }
      await onUpdateProfile({ ...values }, selectedFile);
      message.success("Profile updated successfully");
      setSelectedFile(null);
      setPreviewUrl(null);
      setEditProfileOpen(false);
    } catch (err) {
      message.error(`Update failed: ${err}`);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      if (typeof onChangePassword !== "function") {
        message.error("Change password handler is not provided");
        return;
      }
      await onChangePassword(values.newPassword);
      message.success("Password changed successfully");
      passwordForm.resetFields();
      setChangePasswordOpen(false);
    } catch (err) {
      message.error(`Failed to change password: ${err}`);
    }
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={editProfileOpen}
        onCancel={() => {
          setEditProfileOpen(false);
          setPreviewUrl(null);
          setSelectedFile(null);
        }}
        footer={null}
        width={475}
        centered
        styles={{
          content: {
            borderRadius: 8,
            boxShadow:
              "0 9px 28px 8px rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <div style={{ padding: "20px 0" }}>
          {/* Avatar Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    validateAndSelectFile(file);
                    e.target.value = "";
                  }
                }}
                disabled={profileUpdating}
              />
              <div style={{ position: "relative" }}>
                <Avatar
                  size={100}
                  src={avatarSrc}
                  icon={<UserOutlined />}
                  style={{
                    background: "#D9D9D9",
                    color: token.colorTextSecondary,
                    opacity: profileUpdating ? 0.6 : 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: token.colorBgContainer,
                    border: `2px solid ${token.colorBgContainer}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UploadOutlined
                    style={{
                      fontSize: 16,
                      color: profileUpdating
                        ? token.colorTextDisabled
                        : token.colorTextSecondary,
                    }}
                  />
                </div>
              </div>
            </label>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: token.colorText,
                  marginBottom: 4,
                }}
              >
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "Loading..."}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: token.colorTextSecondary,
                }}
              >
                {user?.email || "Loading..."}
              </div>
            </div>
          </div>

          {/* Form */}
          <Form form={form} layout="vertical" onFinish={handleEditProfile}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input
                disabled
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Button
                onClick={() => setEditProfileOpen(false)}
                style={{
                  height: 44,
                  borderRadius: 8,
                  padding: "0 24px",
                  fontSize: 15,
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={profileUpdating}
                style={{
                  height: 44,
                  borderRadius: 8,
                  padding: "0 24px",
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                Save changes
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePasswordOpen}
        onCancel={() => setChangePasswordOpen(false)}
        footer={null}
        width={475}
        centered
        styles={{
          content: {
            borderRadius: 8,
            boxShadow:
              "0 9px 28px 8px rgba(0, 0, 0, 0.05), 0 3px 6px -4px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <div style={{ padding: "20px 0" }}>
          <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm new password"
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              />
            </Form.Item>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
              }}
            >
              <Button
                onClick={() => setChangePasswordOpen(false)}
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={profileUpdating}
                style={{
                  height: 40,
                  borderRadius: 8,
                }}
              >
                Change Password
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ProfileEdit;
