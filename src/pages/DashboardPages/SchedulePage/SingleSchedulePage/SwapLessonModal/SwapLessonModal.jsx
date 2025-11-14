import React, { useState, useEffect, useMemo } from "react";
import styles from "./SwapLessonModal.module.scss";
import { FiX, FiRepeat } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

const SwapLessonModal = ({ isOpen, onClose, onSave, schedule }) => {
  const { t } = useTranslation();

  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [fromLesson, setFromLesson] = useState("");
  const [toLesson, setToLesson] = useState("");
  const [onceOnly, setOnceOnly] = useState(false);

  const [fromLessons, setFromLessons] = useState([]);
  const [toLessons, setToLessons] = useState([]);

  // ✅ При открытии — сбрасываем всё
  useEffect(() => {
    if (isOpen && schedule?.days?.length > 0) {
      const firstDay = schedule.days[0]?.day || days[0];
      const secondDay = schedule.days[1]?.day || firstDay;
      setFromDay(firstDay);
      setToDay(secondDay);
      setFromLesson("");
      setToLesson("");
      setOnceOnly(false);
    }
  }, [isOpen, schedule]);

  // ✅ При изменении дня всегда пересчитываем уроки
  useEffect(() => {
    if (!schedule) return;

    const fromDayObj = schedule.days.find((d) => d.day === fromDay);
    const toDayObj = schedule.days.find((d) => d.day === toDay);

    // 👇 Сбрасываем перед установкой, чтобы React не “сливал” старые значения
    setFromLessons([]);
    setToLessons([]);

    setTimeout(() => {
      setFromLessons(fromDayObj?.lessons || []);
      setToLessons(toDayObj?.lessons || []);
    }, 0);
  }, [fromDay, toDay, schedule]);

  // ✅ Проверка и сохранение
  const handleSave = () => {
    if (!fromLesson || !toLesson) {
      alert(t("swapModal.alertSelectLessons"));
      return;
    }
    if (fromDay === toDay && fromLesson === toLesson) {
      alert(t("swapModal.alertSameLesson"));
      return;
    }

    onSave({ fromDay, toDay, fromLesson, toLesson, onceOnly });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <FiRepeat />
          </div>
          <div>
            <h3>{t("swapModal.title")}</h3>
            <p>{t("swapModal.description")}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Select boxes */}
        <div className={styles.formRow}>
          {/* From side */}
          <div className={styles.column}>
            <label>{t("swapModal.selectDay")}</label>
            <select
              value={fromDay}
              onChange={(e) => {
                setFromDay(e.target.value);
                setFromLesson("");
              }}
            >
              {schedule?.days?.map((d) => (
                <option key={d.day}>{d.day}</option>
              ))}
            </select>

            <label>{t("swapModal.selectLesson")}</label>
            <select
              value={fromLesson}
              onChange={(e) => setFromLesson(e.target.value)}
            >
              <option value="">{t("swapModal.selectOption")}</option>
              {fromLessons.map((l) => (
                <option key={l._id || l.scienceName} value={l.scienceName}>
                  {l.scienceName} ({l.startTime})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.swapIcon}>
            <FiRepeat />
          </div>

          {/* To side */}
          <div className={styles.column}>
            <label>{t("swapModal.selectDay")}</label>
            <select
              value={toDay}
              onChange={(e) => {
                setToDay(e.target.value);
                setToLesson("");
              }}
            >
              {schedule?.days?.map((d) => (
                <option key={d.day}>{d.day}</option>
              ))}
            </select>

            <label>{t("swapModal.selectLesson")}</label>
            <select
              value={toLesson}
              onChange={(e) => setToLesson(e.target.value)}
            >
              <option value="">{t("swapModal.selectOption")}</option>
              {toLessons.map((l) => (
                <option key={l._id || l.scienceName} value={l.scienceName}>
                  {l.scienceName} ({l.startTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox */}
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={onceOnly}
            onChange={(e) => setOnceOnly(e.target.checked)}
          />
          {t("swapModal.onceOnly")}
        </label>

        {/* Buttons */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("swapModal.cancel")}
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {t("swapModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapLessonModal;