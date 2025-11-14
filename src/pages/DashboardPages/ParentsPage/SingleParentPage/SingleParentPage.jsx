// src/pages/DashboardPages/ParentsPage/SingleParentPage/SingleParentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SingleParentPage.module.scss";
import {
  fetchParentById,
  updateParent,
} from "../../../../App/Api/Parents/parentsSlice";
import ParentInfo from "./ParentInfo/ParentInfo";
import ParentEdit from "./ParentEdit/ParentEdit";

const SingleParentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { current: parent, loading, error } = useSelector((s) => s.parents);
  const [activeTab, setActiveTab] = useState("info");

  // 🔹 Загружаем данные родителя
  useEffect(() => {
    if (id) {
      dispatch(fetchParentById(id));
    }
  }, [id, dispatch]);

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateParent({ id, data })).unwrap();
      setActiveTab("info"); // вернуться на инфо после сохранения
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  if (loading) return <p>⏳ Yuklanmoqda...</p>;
  if (error) return <p>❌ Xatolik: {error}</p>;
  if (!parent) {
    return (
      <div className={styles.page}>
        <p>❌ Ota-ona topilmadi</p>
        <button onClick={() => navigate(-1)}>Ortga qaytish</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {activeTab === "info" && (
        <ParentInfo parent={parent} onEditClick={() => setActiveTab("edit")} />
      )}

      {activeTab === "edit" && (
        <ParentEdit
          parent={parent}
          onBackToInfo={() => setActiveTab("info")}
          onSave={handleUpdate} // 🔹 передаем в редактирование
        />
      )}
    </div>
  );
};

export default SingleParentPage;
