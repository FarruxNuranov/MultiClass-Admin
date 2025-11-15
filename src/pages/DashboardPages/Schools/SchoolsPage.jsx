// src/pages/DashboardPages/StaffPage/StaffPageAntApi.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button } from "antd";
import {
  DollarOutlined,
  UsergroupAddOutlined,
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { deleteTenant, fetchTenants } from "../../../App/Api/tenants/tenantsSlice";

import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import SchoolTable from "./SchoolTable/SchoolTable";
import styles from "./StaffPage.module.scss";

const { Option } = Select;

const StaffPageApi = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [search, setSearch] = useState("");

  // 🔹 Redux’dan ma'lumot olish
  const { list, loading } = useSelector((state) => state.tenants);
  // 🔹 Component mount bo‘lganda API chaqirish
  useEffect(() => {
    dispatch(fetchTenants(""));
  }, [dispatch]);

  // 🔹 Search filtr
  const filteredList = list.filter((item) =>
  item?.title?.toLowerCase().includes(search.toLowerCase())
);
console.log(`filteredList`,filteredList);
  const breadcrumbs = [{ label: "Maktablar" }];

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Statistika */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <UsergroupAddOutlined />
            </div>
            <div>
              <p className={styles.label}>Jami maktablar</p>
              <h2 className={styles.value}>{filteredList.length}</h2>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.iconBox}>
              <DollarOutlined />
            </div>
            <div>
              <p className={styles.label}>Faol tenantlar</p>
              <h2 className={styles.value}>
                {filteredList.filter((x) => x.isActive).length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Filtrlar */}
      <div className={styles.filterGroup}>
        <h2>Maktablar ro’yxati</h2>

        <div className={styles.filters}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Maktab nomi bo‘yicha qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />

          <Button icon={<DownloadOutlined />} className={styles.exportBtn} disabled>
            Excelga yuklash
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={() => navigate("create")}
          >
            Yangi maktab qo‘shish
          </Button>
        </div>
      </div>

      {/* 🔹 Jadval */}
      <div className={styles.tableWrapper}>
        <SchoolTable
          schools={filteredList}
          loading={loading}
          onRowClick={(id) => navigate(id)}
          onDelete={(id) => dispatch(deleteTenant(id))}
          onEdit={(id) => navigate(`edit/${id}`)}
        />
      </div>
    </div>
  );
};

export default StaffPageApi;
