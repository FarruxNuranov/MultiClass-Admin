// StaffPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Space, Flex, message } from "antd";
import styles from "./StaffPage.module.scss";
import { FiDollarSign, FiUsers, FiSearch, FiDownload, FiPlus } from "react-icons/fi";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeacher, fetchTeachers } from "../../../App/Api/Teachers/teachersSlice";
import { fetchClasses } from "../../../App/Api/Classes/classesSlice";
import StaffTable from "./StaffTable/StaffTable";
import { useTranslation } from "react-i18next";
import { fetchRoles } from "../../../App/Api/Roles/rolesSlice";
export const formatNumber = (value) => {
  if (value === undefined || value === null) return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  // 3 xonali bo‘sh joy bilan ajratish
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};
/* 🔹 debounce hook */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const { Option } = Select;

const StaffPage = () => {
  const { t } = useTranslation();
  const breadcrumbs = [{ label: t("staffPage.breadcrumb") }];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [branchId, setBranchId] = useState(localStorage.getItem("branchId") || ""); // ✅ branchId из localStorage
  const {
    list: roles,
    loading: rolesLoading,
    error: rolesError,
  } = useSelector((state) => state.roles);

  const debouncedSearch = useDebounce(search, 400);

  // ✅ следим за изменением branchId в localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "branchId") {
        const newBranch = localStorage.getItem("branchId") || "";
        setBranchId(newBranch);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Redux state
  const { list: staffItems = [],totalPrice: totalPrice = 0, total: staffTotal = 0, loading, error } = useSelector(
    (state) => state.employees
  );
  const classes = useSelector((state) => state.classes.items || []);
  const classesLoading = useSelector((state) => state.classes.loading);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
  // 🔹 Загружаем список сотрудников с фильтрацией по branchId
  console.log(`role`,role);
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      roles:role,
       branch: branchId, // ✅ добавлен branchId
    };
  
    dispatch(fetchTeachers(filters));
  }, [dispatch, debouncedSearch, role, branchId]);

  // 🔹 Загружаем классы (один раз)
  useEffect(() => {
    if (classes.length === 0 && !classesLoading) {
      dispatch(fetchClasses({ branchId })); // ✅ передаем branchId (если API поддерживает)
    }
  }, [dispatch, classes.length, classesLoading, branchId]);

  const handleRowClick = (id) => navigate(`/home/staff/${id}`);

  const handleDelete = (id) => {
      dispatch(deleteTeacher(id))
        .unwrap()
        .then(() => {
          message.success("✅ Xodim o‘chirildi");
          dispatch(fetchTeachers({ search: debouncedSearch, role, branchId }));
        })
        .catch(() => message.error("❌ O‘chirishda xatolik yuz berdi"));
    
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Статистика */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <FiDollarSign />
            </div>
            <div>
              <p className={styles.label}>{t("staffPage.stats.salaryLabel")}</p>
              <h2 className={styles.value}>  {formatNumber(totalPrice)} {t("staffPage.stats.salaryPrice")}</h2>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <FiUsers />
            </div>
            <div>
              <p className={styles.label}>{t("staffPage.stats.staffCountLabel")}</p>
              <h2 className={styles.value}>{staffTotal}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Фильтры */}
      <Flex justify="space-between"  align="center" style={{ flexWrap: "wrap", gap: 12 }}>
        <Space wrap size={12} align="center">
          {/* Поиск */}
          <Input
            allowClear
            prefix={<FiSearch style={{ color: "#9ca3af", fontSize: 16 }} />}
            placeholder={t("staffPage.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: 260,
              height: 40,
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          {/* 🔹 Фильтр по классу */}
          <Select
            value={role || undefined}
            onChange={(v , i) => setRole(i.value)}
            placeholder={t("staffPage.filterAll")}
            allowClear
            loading={rolesLoading}
            style={{
              width: 170,
              height: 40,
              borderRadius: 8,
            }}
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {roles
              .slice()
              .sort((a, b) => a.grade - b.grade || a.title.localeCompare(b.title))
              .map((cls) => (
                <Option key={cls._id} value={cls._id}>
                  {cls.title}
                </Option>
              ))}
          </Select>
        </Space>

        <Space align="center" size={12} wrap>
          <Button icon={<FiDownload />} size="large" disabled>
            {t("staffPage.buttons.export")}
          </Button>

          <Button
            type="primary"
            icon={<FiPlus />}
            size="large"
            onClick={() => navigate("/home/staff/create")}
          >
            {t("staffPage.buttons.add")}
          </Button>
        </Space>
      </Flex>

      {/* 🔹 Таблица */}
      <StaffTable
        staff={staffItems}
        total={staffTotal}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/home/staff/${id}/edit`)}
        onFilter={(id) => setClassId(id)}
      />

      {loading && <p className={styles.loading}>{t("staffPage.loading")}</p>}
      {error && <p className={styles.error}>{t("staffPage.error")}</p>}
    </div>
  );
};

export default StaffPage;