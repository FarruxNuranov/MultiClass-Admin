import React, { useEffect, useRef, useMemo, useState } from "react";
import styles from "./ScheduleStudentPage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyStudentScheduleThunk } from "../../../App/Api/Schedules/studentScheduleSlice";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// 🔹 Локализация на узбекском
const uzLocale = {
  code: "uz",
  week: { dow: 1 },
  buttonText: {
    today: "Bugun",
    month: "Oy",
    week: "Hafta",
    day: "Kun",
    list: "Ro‘yxat",
  },
  dayNames: [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ],
  dayNamesShort: ["Yak", "Du", "Se", "Chor", "Pay", "Jum", "Sha"],
  monthNames: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ],
};

// 🔹 Цвета для предметов
const subjectColors = {
  Matematika: "#93C5FD",
  "Ona tili": "#FDE68A",
  Tarix: "#FCA5A5",
  Fizika: "#A5B4FC",
  Kimyo: "#6EE7B7",
  "Ingliz tili": "#FDBA74",
};

const ScheduleStudentPage = () => {
  const dispatch = useDispatch();
  const calendarRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { items: schedules, loading, error } = useSelector(
    (s) => s.studentSchedule
  );

  // 📱 Отслеживаем размер экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Загружаем расписание студента по токену
  useEffect(() => {
    dispatch(fetchMyStudentScheduleThunk());
  }, [dispatch]);

  const schedule = schedules?.[0];
  const weeks = schedule?.schedule || [];
  const [activeWeekIndex, setActiveWeekIndex] = useState(null);

  // 🔹 Преобразуем уроки в формат FullCalendar
  const events = useMemo(() => {
    if (!weeks.length) return [];

    const all = [];
    weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.lessons.forEach((lesson) => {
          const start = new Date(`${day.date}T${lesson.startTime}`);
          const end = new Date(`${day.date}T${lesson.endTime}`);
          const color = subjectColors[lesson.scienceName] || "#EDE9FE";

          all.push({
            title: lesson.scienceName,
            start,
            end,
            backgroundColor: color,
            borderColor: color,
            textColor: "#111827",
            extendedProps: {
              teacher: lesson.teacherName,
              dayName: day.day,
              weekNumber: week.weekNumber,
            },
          });
        });
      });
    });

    return all;
  }, [weeks]);

  // 🔹 Определяем текущую неделю
  useEffect(() => {
    if (calendarRef.current && weeks.length > 0) {
      const api = calendarRef.current.getApi();
      const today = new Date();

      const foundIndex = weeks.findIndex((week) => {
        const start = new Date(week.weekStart);
        const end = new Date(week.weekEnd);
        return today >= start && today <= end;
      });

      const initialIndex = foundIndex !== -1 ? foundIndex : 0;
      setActiveWeekIndex(initialIndex);
      api.gotoDate(weeks[initialIndex].weekStart);
    }
  }, [weeks]);

  // 🔹 Обновляем активную неделю при переключении
  const handleDatesSet = (arg) => {
    const viewStart = new Date(arg.start);
    const viewEnd = new Date(arg.end);

    const index = weeks.findIndex((week) => {
      const weekStart = new Date(week.weekStart);
      const weekEnd = new Date(week.weekEnd);
      return viewStart <= weekEnd && viewEnd >= weekStart;
    });

    if (index !== -1) setActiveWeekIndex(index);
  };

  return (
    <div className={styles.page}>
      {loading ? (
        <p className={styles.loading}>⏳ Yuklanmoqda...</p>
      ) : error ? (
        <p className={styles.error}>❌ {error}</p>
      ) : !schedule ? (
        <p className={styles.empty}>⚠️ Jadval topilmadi</p>
      ) : (
        <div className={styles.calendarWrapper}>
          {/* 🔹 Неделя */}
          {activeWeekIndex !== null && (
            <div className={styles.weekInfo}>
              <strong>{weeks[activeWeekIndex].weekNumber}-hafta</strong>{" "}
              <span>
                ({weeks[activeWeekIndex].weekStart} —{" "}
                {weeks[activeWeekIndex].weekEnd})
              </span>
            </div>
          )}

          {/* 🔹 Календарь */}
          <FullCalendar
  ref={calendarRef}
  plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
  initialView={isMobile ? "listWeek" : "timeGridWeek"}
  height={isMobile ? "auto" : "calc(100vh - 180px)"}
  locales={[uzLocale]}
  locale="uz"
  headerToolbar={{
    left: isMobile ? "today prev,next" : "prev,next today",
    center: "title",
    right: "",
  }}
  allDaySlot={false}
  nowIndicator
  firstDay={1}
  datesSet={handleDatesSet}
  /* ✅ Исправляем формат названий */
  dayHeaderFormat={{
    weekday: "long", // Полное название дня: "Dushanba"
    day: "numeric",  // Число: 6
    month: "short",  // Месяц короткий: "Okt"
  }}
  titleFormat={{
    year: "numeric", // "2025"
    month: "long",   // "Oktyabr"
  }}
  events={events}
  eventContent={(arg) =>
    isMobile ? (
      <div className={styles.listItem}>
        <div className={styles.listHeader}>
          <span className={styles.subject}>{arg.event.title}</span>
          <span className={styles.time}>{arg.timeText}</span>
        </div>
        <div className={styles.listMeta}>
          👨‍🏫 {arg.event.extendedProps.teacher} • 📅{" "}
          {arg.event.extendedProps.dayName}
        </div>
      </div>
    ) : (
      <div className={styles.eventCard}>
        <div className={styles.time}>{arg.timeText}</div>
        <div className={styles.subject}>{arg.event.title}</div>
        <div className={styles.teacher}>
          👨‍🏫 {arg.event.extendedProps.teacher}
        </div>
        <div className={styles.meta}>
          📅 {arg.event.extendedProps.dayName} • Hafta{" "}
          {arg.event.extendedProps.weekNumber}
        </div>
      </div>
    )
  }
/>
        </div>
      )}
    </div>
  );
};

export default ScheduleStudentPage;