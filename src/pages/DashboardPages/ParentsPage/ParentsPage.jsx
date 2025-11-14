import React, { useEffect, useState } from "react";
import styles from "./ParentsPage.module.scss";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import { FiSearch, FiDownload, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParents,
  deleteParent,
} from "../../../App/Api/Parents/parentsSlice";
import ParentsTable from "./ParentsTable/ParentsTable";
import { useTranslation } from "react-i18next";
import { Input, Button, Space, Flex, message } from "antd";
import ParentEdit from "./SingleParentPage/ParentEdit/ParentEdit";

/* 🔹 debounce hook */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const ParentsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeParent, setActiveParent] = useState(null);
  const [activeTab, setActiveTab] = useState("table"); // table | edit
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [branchId, setBranchId] = useState(localStorage.getItem("branchId") || "");

  const debouncedSearch = useDebounce(search, 400);
  const limit = 10;

  const { list: parents, total = 0, loading, error } = useSelector(
    (state) => state.parents
  );

  const breadcrumbs = [{ label: t("parentsPage.title") }];

  /* 🔹 Обновляем branchId, если его изменили в другом окне */
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

  /* 🔹 Загрузка данных */
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      page,
      limit,
    };

    if (branchId) filters.branchId = branchId;

    dispatch(fetchParents(filters));
  }, [dispatch, debouncedSearch, page, limit, branchId]);

  const handleRowClick = (id) => navigate(`/home/parents/${id}`);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm(t("parentsPage.confirmDelete"))) {
      dispatch(deleteParent(id))
        .unwrap()
        .then(() => {
          message.success(t("parentsPage.deleteSuccess"));
          dispatch(fetchParents({ search: debouncedSearch, page, limit, branchId }));
        })
        .catch(() => message.error(t("parentsPage.deleteError")));
    }
  };

  const handlePageChange = (selected) => setPage(selected.selected + 1);

  return (
    <div className={styles.page}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Статистика */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <div>
            <p className={styles.label}>{t("parentsPage.total")}</p>
            <h2 className={styles.value}>{total || parents?.length || 0}</h2>
          </div>
         
        </div>

        <div className={styles.card}>
          <div>
            <p className={styles.label}>{t("parentsPage.childrenCount")}</p>
            <h2 className={styles.value}>
              {parents?.reduce((sum, p) => sum + (p.children?.length || 0), 0)}
            </h2>
          </div>
          
        </div>
      </div>

      {/* 🔹 Шапка */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 24, flexWrap: "wrap", gap: 12 }}
      >
        {/* 🔍 Поиск */}
        <Space align="center">
          <Input
            allowClear
            size="large"
            prefix={<FiSearch style={{ color: "var(--colors-text-text-quaternary-500)", fontSize: 16 }} />}
            placeholder={t("parentsPage.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              display: "flex",
              alignItems: "center",
              width: 260,
              height: 40,
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </Space>

        {/* ⚙️ Правые кнопки */}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--colors-background-bg-secondary-alt)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--colors-background-bg-primary)";
            }}
          >
            {t("parentsPage.export")}
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
            onClick={() => navigate("/home/parents/create")}
          >
            {t("parentsPage.add")}
          </Button>
        </Space>
      </Flex>

      {/* 🔹 Таблица */}
      <ParentsTable
        parents={parents}
        loading={loading}
        error={error}
        navigate={navigate}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onEdit={(parent) => {
          setActiveParent(parent);
          setActiveTab("edit");
        }}
      />

      {/* 🔹 Редактирование родителя */}
      {activeTab === "edit" && activeParent && (
        <ParentEdit
          parent={activeParent}
          onBackToInfo={() => setActiveTab("table")}
          onSave={(updatedParent) => {
            setActiveParent(updatedParent);
            setActiveTab("table");
          }}
        />
      )}
    </div>
  );
};

export default ParentsPage;