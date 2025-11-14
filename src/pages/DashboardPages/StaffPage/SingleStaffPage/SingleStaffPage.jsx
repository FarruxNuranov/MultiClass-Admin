import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherById, updateTeacher } from "../../../../App/Api/Teachers/teachersSlice";
import styles from "./SingleStaffPage.module.scss";
import StaffInfo from "./StaffInfo/StaffInfo";
import StaffEdit from "./StaffEdit/StaffEdit";

const SingleStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  const { current, loading, error } = useSelector((s) => s.employees);

  useEffect(() => {
    if (id) dispatch(fetchTeacherById(id));
  }, [id, dispatch]);

  const handleSave = async (formData) => {
    try {
      await dispatch(updateTeacher({ id, data: formData })).unwrap();
      // апдейтим current заново
      await dispatch(fetchTeacherById(id));
      setActiveTab("info");
    } catch (err) {
      console.error("❌ Xatolik update:", err);
      alert("Xatolik yuz berdi: " + err);
    }
  };

  if (loading) {
    return <div className={styles.page}>⏳ Yuklanmoqda...</div>;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p>❌ Xatolik: {error}</p>
        <button onClick={() => navigate(-1)}>Ortga qaytish</button>
      </div>
    );
  }

  if (!current || Object.keys(current).length === 0) {
    return (
      <div className={styles.page}>
        <p>❌ Xodim topilmadi</p>
        <button onClick={() => navigate(-1)}>Ortga qaytish</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {activeTab === "info" && (
        <StaffInfo staff={current} onEditClick={() => setActiveTab("edit")} />
      )}
      {activeTab === "edit" && (
        <StaffEdit
          staff={current}
          onBack={() => setActiveTab("info")}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SingleStaffPage;
