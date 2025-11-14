// src/pages/DashboardPages/MessagesPage/SingleAnnouncement/SingleAnnouncementPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AnnouncementInfo from "./AnnouncementInfo/AnnouncementInfo";
import AnnouncementEdit from "./AnnouncementEdit/AnnouncementEdit";
import { fetchNewsById, updateNews } from "../../../../App/Api/News/newsSlice";

const SingleAnnouncementPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");

  const { current: announcement, loading, error } = useSelector((s) => s.news);

  // ✅ Загружаем новость по ID при монтировании
  useEffect(() => {
    if (id) {
      dispatch(fetchNewsById(id));
    }
  }, [dispatch, id]);

  // ✅ Сохранение изменений
  const handleSave = async (updated) => {
    try {
      await dispatch(updateNews({ id, data: updated })).unwrap();
      setActiveTab("info"); // возвращаемся в режим просмотра
    } catch (err) {
      console.error(err);
      alert("❌ Xatolik: " + err);
    }
  };

  // ✅ Состояния загрузки и ошибок
  if (loading) return <p>⏳ Yuklanmoqda...</p>;
  if (error) return <p>❌ Xatolik: {error}</p>;
  if (!announcement) return <p>❌ E’lon topilmadi</p>;

  return (
    <>
      {activeTab === "info" && (
        <AnnouncementInfo
          announcement={announcement}
          onEditClick={() => setActiveTab("edit")}
        />
      )}

      {activeTab === "edit" && (
        <AnnouncementEdit
          announcement={announcement}
          onBackToInfo={() => setActiveTab("info")}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default SingleAnnouncementPage;