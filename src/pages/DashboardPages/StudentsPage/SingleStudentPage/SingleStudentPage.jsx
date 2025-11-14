// src/pages/DashboardPages/StudentsPage/SingleStudentPage/SingleStudentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SingleStudentPage.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import StudentInfo from "./StudentInfo/StudentInfo";
import StudentEdit from "./StudentEdit/StudentEdit";
import { fetchStudentById } from "../../../../App/Api/Students/studentsSlice";

const SingleStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    current: student,
    loading,
    error,
  } = useSelector((state) => state.students);

  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
      console.log(`test`);
    }
  }, [id, dispatch]);

  if (loading) return <p>⏳ Yuklanmoqda...</p>;
  if (error) return <p>❌ Xatolik: {error}</p>;
  if (!student) {
    return (
      <div className={styles.page}>
        <p>❌ O‘quvchi topilmadi</p>
        <button onClick={() => navigate(-1)}>Ortga qaytish</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {activeTab === "info" && (
        <StudentInfo
          student={student}
          onEditClick={() => setActiveTab("edit")}
        />
      )}

      {activeTab === "edit" && (
        <StudentEdit
          student={student}
          onBackToInfo={() => navigate("/home/students")}
        />
      )}
    </div>
  );
};

export default SingleStudentPage;
