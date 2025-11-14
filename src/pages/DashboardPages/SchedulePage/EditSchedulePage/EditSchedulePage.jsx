// src/pages/DashboardPages/SchedulePage/EditSchedulePage/EditSchedulePage.jsx
import React, { useState } from "react";
import styles from "./EditSchedulePage.module.scss";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import {
  scheduleData,
  subjectsData,
  teachersData,
} from "../../../../data/scheduleData";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EditSchedulePage = () => {
  
  const navigate =useNavigate()

  const [rowsByClass, setRowsByClass] = useState(
    Object.fromEntries(
      scheduleData.flatMap((grade) =>
        grade.classes.map((cls) => [
          cls.class,
          [
            // стартовый пример
            { subject: "Matematika", hours: 4, teacher: 1 },
          ],
        ])
      )
    )
  );

  // Храним новые строки (форма ввода) для каждого класса
  const [newRows, setNewRows] = useState(
    Object.fromEntries(
      scheduleData.flatMap((grade) =>
        grade.classes.map((cls) => [
          cls.class,
          { subject: "", hours: 0, teacher: "" },
        ])
      )
    )
  );

  // Добавить строку
  const addRow = (className) => {
    const newRow = newRows[className];
    if (!newRow.subject || !newRow.teacher || newRow.hours <= 0) return;

    setRowsByClass({
      ...rowsByClass,
      [className]: [...rowsByClass[className], newRow],
    });

    setNewRows({
      ...newRows,
      [className]: { subject: "", hours: 0, teacher: "" },
    });
  };

  // Удалить строку
  const deleteRow = (className, idx) => {
    setRowsByClass({
      ...rowsByClass,
      [className]: rowsByClass[className].filter((_, i) => i !== idx),
    });
  };

  return (
    <div className={styles.page}>
      {/* 🔹 Хлебные крошки */}
      <Breadcrumbs
        items={[
          { label: "Dars jadvali", to: "/dashboard/schedule" },
          { label: "Jadvalni tahrirlash" },
        ]}
      />

      {/* 🔹 Хедер */}
      <div className={styles.header}>
        <h1 className={styles.title}>Kundalikni qayta tuzish</h1>
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.cancelBtn}>Bekor qilish</button>
          <button onClick={() => navigate(-1)} className={styles.nextBtn}>Davom etish</button>
        </div>
      </div>

      {/* 🔹 Блоки по всем классам */}
      {scheduleData.map((grade) =>
        grade.classes.map((cls) => (
          <div key={cls.class} className={styles.block}>
            <div className={styles.left}>
              <h3>{cls.class} dars jadvali</h3>
              <p>
                Fanlarni va haftalik dars soatlarini kiriting va dastur o‘zi
                dars jadvalini yaratadi.
              </p>
            </div>
            <div className={styles.right}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fan</th>
                      <th>Soat</th>
                      <th>Ustoz</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsByClass[cls.class]?.map((row, idx) => {
                      const teacher = teachersData.find(
                        (t) => t.id === Number(row.teacher)
                      );
                      return (
                        <tr key={idx}>
                          <td>{row.subject}</td>
                          <td>{row.hours}</td>
                          <td>
                            <div className={styles.teacherCell}>
                              {teacher?.avatar && (
                                <img
                                  src={teacher.avatar}
                                  alt={teacher.name}
                                  className={styles.avatar}
                                />
                              )}
                              <span>{teacher?.name || "-"}</span>
                            </div>
                          </td>
                          <td>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => deleteRow(cls.class, idx)}
                            >
                            <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Форма добавления */}
                    <tr className={styles.addRow}>
                      <td>
                        <select
                          value={newRows[cls.class].subject}
                          onChange={(e) =>
                            setNewRows({
                              ...newRows,
                              [cls.class]: {
                                ...newRows[cls.class],
                                subject: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Fanni tanlang</option>
                          {subjectsData.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={newRows[cls.class].hours}
                          onChange={(e) =>
                            setNewRows({
                              ...newRows,
                              [cls.class]: {
                                ...newRows[cls.class],
                                hours: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={newRows[cls.class].teacher}
                          onChange={(e) =>
                            setNewRows({
                              ...newRows,
                              [cls.class]: {
                                ...newRows[cls.class],
                                teacher: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="">Ustozni tanlang</option>
                          {teachersData.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                {/* Футер с кнопкой */}
                <div className={styles.addRowWrapper}>
                  <button
                    className={styles.addRowBtn}
                    onClick={() => addRow(cls.class)}
                  >
                    + Fan qo‘shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EditSchedulePage;
