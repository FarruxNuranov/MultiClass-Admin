// src/pages/SettingsPage/LessonPlanPage/LessonDetailsPage/LessonDetailsPage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LessonInfoDetails from "./LessonInfoDetails/LessonInfoDetails";
import LessonEditDetails from "./LessonEditDetails/LessonEditDetails";
import styles from "./LessonDetailsPage.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";

import {
  fetchTopicById,
  deleteTopic,
} from "../../../../App/Api/Topics/topicsSlice";

const LessonDetailsPage = () => {
  const { id: classId, topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = React.useState(false);

  // достаем из redux
  const { current: topic, loading, error } = useSelector((s) => s.topics);

  // при загрузке → запрос топика
  useEffect(() => {
    if (topicId) {
      dispatch(fetchTopicById(topicId));
    }
  }, [dispatch, topicId]);

  // 🔹 удаление
  const handleDelete = async (id) => {
    if (window.confirm("Haqiqatan ham bu mavzuni o‘chirmoqchimisiz?")) {
      await dispatch(deleteTopic(id));
      navigate(`/home/lesson-plan/${classId}`);
    }
  };

  const breadcrumbs = [
    { label: "Dars rejasi", to: "/home/lesson-plan" },
    { label: `${classId}-sinf`, to: `/home/lesson-plan/${classId}` },
    { label: "Mavzu tafsilotlari" },
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <Breadcrumbs items={breadcrumbs} />
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Breadcrumbs items={breadcrumbs} />
        <p className={styles.error}>Xato: {error}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className={styles.page}>
        <Breadcrumbs items={breadcrumbs} />
        <h2 className={styles.title}>Mavzu topilmadi</h2>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      {/* 🔹 Переключение между Info и Edit */}
      {isEdit ? (
        <LessonEditDetails topic={topic} onCancel={() => setIsEdit(false)} />
      ) : (
        <LessonInfoDetails
          topic={topic}
          id={classId}
          onEdit={() => setIsEdit(true)}
          onDelete={handleDelete} // 👈 добавлено
        />
      )}
    </div>
  );
};

export default LessonDetailsPage;