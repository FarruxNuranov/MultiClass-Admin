// src/pages/DashboardPages/SchedulePage/EditSingleSchedulePage/EditSingleSchedulePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditSingleSchedulePage.module.scss";
import { FiTrash2 } from "react-icons/fi";
import Breadcrumbs from "../../../../../Components/Breadcrumbs/Breadcrumbs";
import config from "../../../../../config/config";
import { useTranslation } from "react-i18next";

const EditSingleSchedulePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ subject: "", hours: 0, teacher: "" });
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [lessonPlanId, setLessonPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Получаем LessonPlans
  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${config.apiUrl}/lessonplans?class=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const classData = data.data?.[0];
      if (classData) {
        setLessonPlanId(classData._id);
        setClassName(classData.className);
        setRows(
          classData.sciences.map((s) => ({
            _id: s._id,
            subject: s.scienceName,
            hours: s.weeklyHours,
            teacher: s.teacher,
            teacherName: s.teacherName,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching lesson plans:", err);
      alert(t("editSchedule.errorFetch"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Получаем список учителей
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeachers(data.data || []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  // ✅ Получаем список предметов
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/sciences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubjects(data.data || []);
    } catch (err) {
      console.error("Error fetching sciences:", err);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
    fetchTeachers();
    fetchSubjects();
  }, [id]);

  // ✅ Добавить строку
  const addRow = () => {
    if (!newRow.subject || !newRow.teacher || newRow.hours <= 0) return;

    const teacher = teachers.find((t) => t._id === newRow.teacher);

    setRows([
      ...rows,
      {
        subject: newRow.subject,
        hours: newRow.hours,
        teacher: newRow.teacher,
        teacherName: `${teacher?.firstName || ""} ${teacher?.lastName || ""}`.trim(),
      },
    ]);
    setNewRow({ subject: "", hours: 0, teacher: "" });
  };

  // ✅ Удалить строку
  const deleteRow = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  // ✅ Редактирование строки
  const handleEditChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;

    if (field === "teacher") {
      const teacher = teachers.find((t) => t._id === value);
      updated[idx].teacherName = teacher
        ? `${teacher.firstName} ${teacher.lastName}`
        : "";
    }

    setRows(updated);
  };

  // ✅ Сохранить
  const handleSave = async () => {
    try {
      const payload = {
        class: id,
        className,
        sciences: rows.map((r) => ({
          scienceName: r.subject,
          weeklyHours: r.hours,
          teacher: r.teacher,
          teacherName: r.teacherName,
        })),
      };

      const url = lessonPlanId
        ? `${config.apiUrl}/lessonplans/${lessonPlanId}`
        : `${config.apiUrl}/lessonplans`;

      const method = lessonPlanId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save lesson plan");

      navigate("/home/schedule");
    } catch (err) {
      console.error("Error saving lesson plan:", err);
      alert(t("editSchedule.errorSave", { message: err.message }));
    }
  };

  if (loading)
    return <div className={styles.loader}>{t("editSchedule.loading")}</div>;

  

  return (
    <div className={styles.page}>
      <Breadcrumbs/>

      <div className={styles.header}>
        <h1 className={styles.title}>
          {t("editSchedule.title", { className: className || id })}
        </h1>
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.cancelBtn}>
            {t("editSchedule.cancel")}
          </button>
          <button onClick={handleSave} className={styles.nextBtn}>
            {t("editSchedule.save")}
          </button>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.left}>
          <h3>{t("editSchedule.introTitle", { className: className || id })}</h3>
          <p>{t("editSchedule.introDescription")}</p>
        </div>

        <div className={styles.right}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("editSchedule.tableSubject")}</th>
                  <th>{t("editSchedule.tableHours")}</th>
                  <th>{t("editSchedule.tableTeacher")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={styles.tableRow}
                    onClick={() => setEditingIndex(idx)}
                  >
                    <td>
                      {editingIndex === idx ? (
                        <select
                          value={row.subject}
                          onChange={(e) =>
                            handleEditChange(idx, "subject", e.target.value)
                          }
                        >
                          <option value="">{t("editSchedule.selectSubject")}</option>
                          {subjects.map((s) => (
                            <option key={s._id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.subject
                      )}
                    </td>

                    <td>
                      {editingIndex === idx ? (
                        <input
                          type="number"
                          min="0"
                          value={row.hours}
                          onChange={(e) =>
                            handleEditChange(idx, "hours", Number(e.target.value))
                          }
                        />
                      ) : (
                        row.hours
                      )}
                    </td>

                    <td>
                      {editingIndex === idx ? (
                        <select
                          value={row.teacher}
                          onChange={(e) =>
                            handleEditChange(idx, "teacher", e.target.value)
                          }
                        >
                          <option value="">{t("editSchedule.selectTeacher")}</option>
                          {teachers.map((tch) => (
                            <option key={tch._id} value={tch._id}>
                              {tch.firstName} {tch.lastName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.teacherName
                      )}
                    </td>

                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRow(idx);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* 🔹 Добавление новой строки */}
                <tr className={styles.addRow}>
                  <td>
                    <select
                      value={newRow.subject}
                      onChange={(e) =>
                        setNewRow({ ...newRow, subject: e.target.value })
                      }
                    >
                      <option value="">{t("editSchedule.selectSubject")}</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={newRow.hours}
                      onChange={(e) =>
                        setNewRow({
                          ...newRow,
                          hours: Number(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={newRow.teacher}
                      onChange={(e) =>
                        setNewRow({ ...newRow, teacher: e.target.value })
                      }
                    >
                      <option value="">{t("editSchedule.selectTeacher")}</option>
                      {teachers.map((tch) => (
                        <option key={tch._id} value={tch._id}>
                          {tch.firstName} {tch.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <div className={styles.addRowWrapper}>
              <button className={styles.addRowBtn} onClick={addRow}>
                {t("editSchedule.addRow")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSingleSchedulePage;