// src/pages/TeacherDashboard/TeacherSchedulePage/TeacherSchedulePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchTeacherScheduleThunk } from "../../../App/Api/Schedules/teacherScheduleSlice";
import styles from "./TeacherSchedulePage.module.scss";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

// ✅ Узбекская локализация
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
  allDayText: "Kun bo‘yi",
  moreLinkText: (n) => `yana ${n}`,
  noEventsText: "Darslar yo‘q",
  dayNames: [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ],
  dayNamesShort: ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha"],
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

// 🎨 Цвета для разных классов
const classColors = {
  A: "#93C5FD",
  B: "#FDE68A",
  C: "#A5B4FC",
  D: "#FDBA74",
  default: "#EDE9FE",
};

const TeacherSchedulePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const calendarRef = useRef();

  const {
    items: schedules = [],
    loading,
    error,
  } = useSelector((s) => s.teacherSchedule);

  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  // 🔹 Загружаем расписание
  useEffect(() => {
    dispatch(fetchTeacherScheduleThunk());
  }, [dispatch]);

  // 🔹 Формируем события для FullCalendar
  const events = useMemo(() => {
    if (!schedules?.length) return [];

    const all = [];

    schedules.forEach((week) => {
      if (!week.days) return;

      week.days.forEach((day) => {
        if (!day.lessons) return;

        day.lessons.forEach((lesson) => {
          const start = new Date(`${day.date}T${lesson.startTime}`);
          const end = new Date(`${day.date}T${lesson.endTime}`);

          const fullClassName = lesson.class
            ? `${lesson.class.grade || ""}-${lesson.class.title || ""}`
            : t("teachersSchedulePage.unknownClass");

          const color = classColors[lesson.class?.title] || classColors.default;

          all.push({
            title: `${lesson.scienceName} — ${fullClassName}`,
            start,
            end,
            backgroundColor: color,
            borderColor: color,
            textColor: "#111827",
            extendedProps: {
              dayName: day.day,
              classTitle: fullClassName,
              science: lesson.scienceName,
            },
          });
        });
      });
    });

    return all;
  }, [schedules, t]);

  // 🔹 При монтировании открываем неделю, где сегодня
  useEffect(() => {
    if (calendarRef.current && schedules.length > 0) {
      const api = calendarRef.current.getApi();
      const today = new Date();

      const foundWeekIndex = schedules.findIndex((week) => {
        const start = new Date(week.weekStart);
        const end = new Date(week.weekEnd);
        return today >= start && today <= end;
      });

      const indexToSet = foundWeekIndex !== -1 ? foundWeekIndex : 0;
      setActiveWeekIndex(indexToSet);
      api.gotoDate(schedules[indexToSet].weekStart);
    }
  }, [schedules]);

  const currentWeek = schedules[activeWeekIndex];

  return (
    <div className={styles.page}>
      {/* <Breadcrumbs
      /> */}

      {/* 🔹 Info bar */}
      {currentWeek && (
        <div className={styles.topBar}>
          <div className={styles.weekInfo}>
            <strong>
              {currentWeek.weekNumber}-{t("teachersSchedulePage.week")}
            </strong>{" "}
            <span>
              ({currentWeek.weekStart} — {currentWeek.weekEnd})
            </span>
          </div>
        </div>
      )}

      {/* 🔹 Calendar */}
      <div className={styles.calendarWrapper}>
        {loading ? (
          <p className={styles.loading}>{t("teachersSchedulePage.status.loading")}</p>
        ) : error ? (
          <p className={styles.error}>{t("teachersSchedulePage.status.error", { error })}</p>
        ) : !schedules?.length ? (
          <p className={styles.empty}>{t("teachersSchedulePage.status.empty")}</p>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
            locales={[uzLocale]}
            locale="uz"
            initialView="timeGridWeek"
            height="calc(100vh - 180px)"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "listWeek,timeGridWeek,dayGridMonth",
            }}
            nowIndicator
            allDaySlot={false}
            firstDay={1}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            slotLabelInterval="00:30"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dayHeaderFormat={{ weekday: "short", day: "numeric" }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            events={events}
            eventContent={(arg) => (
              <div className={styles.eventBox}>
                <div className={styles.subject}>
                  {arg.event.extendedProps.science}
                </div>
                <div className={styles.className}>
                  {arg.event.extendedProps.classTitle}
                </div>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherSchedulePage;