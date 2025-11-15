// src/pages/CreateSchool/CreateSchool.jsx
import React, { useEffect, useState } from "react";
import { Form, Button, message, Card } from "antd";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import SchoolInfoCard from "./SchoolInfoCard/SchoolInfoCard";
import AdminInfoCard from "./AdminInfoCard/AdminInfoCard";
import { createRole } from "../../../../App/Api/roles/rolesSlice";
import { createTenant, fetchTenantById, updateTenant } from "../../../../App/Api/tenants/tenantsSlice";

const CreateSchool = ({ onSaved }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tenantId, setTenantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: SchoolInfo, Step 2: AdminInfo

  // Edit holatda ma'lumotlarni olish
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dispatch(fetchTenantById(id))
      .unwrap()
      .then((res) => {
        const data = res?.data;
        if (data) {
          form.setFieldsValue({
            name: data.title,
            note: data.note || "",
            tariff: data.tariff || "basic",
            discount: data.discount || 0,
          });
          setTenantId(data._id);
        }
      })
      .catch(() => message.error("Maktab ma'lumotlarini olishda xatolik"))
      .finally(() => setLoading(false));
  }, [id, dispatch, form]);

  const handleSchoolSubmit = async (values) => {
    setLoading(true);
    try {
      if (!tenantId) {
        // CREATE
        const tenantRes = await dispatch(createTenant({ title: values.name, note: values.note || "" })).unwrap();
        const createdTenantId = tenantRes?._id || tenantRes?.data?._id;
        if (!createdTenantId) return message.error("Tenant ID olinmadi");
        setTenantId(createdTenantId);

        // ROLE yaratish
        await dispatch(createRole({ title: "school_superadmin", tenantId: createdTenantId })).unwrap();
        message.success("Maktab va role muvaffaqiyatli yaratildi");

        // Step 2 ga o'tish
        setStep(2);
      } else {
        // EDIT
        await dispatch(updateTenant({ id: tenantId, data: { title: values.name, note: values.note, tariff: values.tariff, discount: values.discount } })).unwrap();
        message.success("Maktab muvaffaqiyatli yangilandi");

        // Edit holatda sahifada qoladi, step 2 ga o'tmaydi
      }
    } catch (err) {
      console.error(err);
      message.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSave = async () => {
    try {
      const values = await form.validateFields(); // Parentdagi form bilan tekshiradi
      console.log("AdminInfo values:", values);
      message.success("Form valid va log chiqarildi");
      // API chaqirish tayyor: seedAdmin(values)
    } catch (err) {
      console.log("Validation error:", err);
      message.error("Formani to‘ldirishda xatolik");
    }
  };
  

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      {step === 1 && (
        <Card title={tenantId ? "Maktabni tahrirlash" : "Yangi maktab yaratish"} style={{ borderRadius: 12 }}>
          <Form form={form} layout="vertical" onFinish={handleSchoolSubmit}>
            <SchoolInfoCard form={form} />
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Saqlash
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {step === 2 && tenantId && (
        <Card title="Admin qo‘shish" style={{ borderRadius: 12 }}>
          <AdminInfoCard tenantId={tenantId} form={form} />
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={handleAdminSave}>
              Saqlash
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateSchool;
