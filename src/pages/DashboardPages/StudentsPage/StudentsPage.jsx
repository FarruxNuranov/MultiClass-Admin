// src/pages/DashboardPages/StudentsPage/StudentsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentsPage.module.scss";
import { FiUsers, FiSearch, FiDownload, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  deleteStudent,
} from "../../../App/Api/Students/studentsSlice";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import StudentsTable from "./StudentsTable/StudentsTable";
import { useTranslation } from "react-i18next";
import { Input, Select, Button, Space, Flex, message } from "antd";
import { fetchClasses } from "../../../App/Api/Classes/classesSlice";

/* 🔹 debounce hook */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

const { Option } = Select;

const StudentsPage = () => {
  const { t } = useTranslation();
  const breadcrumbs = [{ label: t("studentsPage.breadcrumbsMain") }];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: classList = [], loading: cLoading } = useSelector(
    (s) => s.classes || {}
  );
  /* 🔹 Текущее значение филиала */
  const [branchId, setBranchId] = useState(
    localStorage.getItem("branchId") || ""
  );

  /* 🔹 Redux state */
  const {
    list: students,
    total = 0,
    limit = 215,
    loading,
    error,
  } = useSelector((state) => state.students);

  /* 🔹 Локальные фильтры */
  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (branchId) {
      dispatch(fetchClasses({ branchId })); // Agar branchId kerak bo‘lsa filter bilan
    }
  }, [dispatch, branchId]);

  /* 🔹 Отслеживаем изменения филиала из localStorage */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "branchId") {
        const newBranch = localStorage.getItem("branchId") || "";
        setBranchId(newBranch);

        if (newBranch) {
          message.info(`Filial o‘zgartirildi`);
        } else {
          message.info(`Filial tanlanmadi`);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* 🔹 Загружаем студентов при изменении фильтров или branchId */
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      classId,
      page,
      limit,
    };

    if (branchId) filters.branchId = branchId;
    dispatch(fetchStudents(filters));
  }, [dispatch, debouncedSearch, classId, page, limit, branchId]);

  /* 🔹 Обработчики */
  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  const handleRowClick = (id) => navigate(`/home/students/${id}`);
  const handleEdit = (id) => navigate(`/home/students/${id}/edit`);
  const handleCall = (phone) => (window.location.href = `tel:${phone}`);
  const handlePageChange = (selected) => setPage(selected.selected + 1);

  /* 🔹 Рендер */
  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <Flex
        justify="space-between"
        align="center"
        style={{ marginTop: 24, flexWrap: "wrap", gap: 12 }}
      >
        <Space wrap size={12} align="center">
          <Input
            allowClear
            prefix={<FiSearch style={{ color: "var(--colors-text-text-quaternary-500)", fontSize: 16 }} />}
            placeholder={t("studentsPage.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: 260,
              height: 40,
              borderRadius: 8,
              fontSize: 14,
            }}
          />

          <Select
            value={classId || undefined} // << bu muhim
            onChange={(v) => setClassId(v)}
            placeholder={t("studentsPage.classes")}
            style={{ width: 170, height: 40, borderRadius: 8 }}
            size="large"
            allowClear
            loading={cLoading}
            showSearch
            optionFilterProp="children"
          >
            {classList.map((cls) => (
              <Option key={cls._id} value={cls._id}>
                {cls.grade}-{cls.title}
              </Option>
            ))}
          </Select>
        </Space>

        <Space align="center" size={12} wrap>
          <Button
            icon={<FiDownload />}
            size="large"
            style={{
              height: 40,
              borderRadius: 8,
              border: "1px solid var(--colors-border-border-primary)",
              fontWeight: 600,
              color: "var(--colors-text-text-secondary-700)",
              background: "var(--colors-background-bg-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--colors-background-bg-secondary-alt)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--colors-background-bg-primary)")}
          >
            {t("studentsPage.export")}
          </Button>

          <Button
            type="primary"
            icon={<FiPlus />}
            size="large"
            style={{
              height: 40,
              borderRadius: 8,
              background: "var(--colors-brand-600)",
              fontWeight: 600,
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--colors-brand-500)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--colors-brand-600)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onClick={() => navigate("/home/students/create")}
          >
            {t("studentsPage.addStudent")}
          </Button>
        </Space>
      </Flex>

      {/* 🔹 Таблица */}
      <StudentsTable
        students={students}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onCall={handleCall}
      />
    </div>
  );
};

export default StudentsPage;
