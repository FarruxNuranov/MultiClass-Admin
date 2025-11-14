// src/pages/DashboardPages/SchedulePage/SingleSchedulePage/SingleSchedulePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSchedulesThunk,
  updateScheduleThunk,
} from "../../../../App/Api/Schedules/schedulesSlice";
import { ROLES } from "../../../../config/roles";
import styles from "./SingleSchedulePage.module.scss";
import { FiRefreshCw, FiRepeat } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Breadcrumbs from "../../../../Components/Breadcrumbs/Breadcrumbs";
import SwapLessonModal from "./SwapLessonModal/SwapLessonModal";
import Loader from "../../../../Components/UI/Loader/Loader";
import { toast } from "react-toastify";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const SingleSchedulePage = () => {
  const { t } = useTranslation();
  const { id: paramsId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const calendarRef = useRef();

  const [isModalOpen, setModalOpen] = useState(false);
  const [activeWeekIndex, setActiveWeekIndex] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role");
  const { items: schedules = [], loading, error } = useSelector(
    (state) => state.schedules
  );

  const classId = useMemo(
    () => paramsId || location.pathname.split("/").pop(),
    [paramsId, location.pathname]
  );

  const subjectColors = useMemo(
    () => ({
      Matematika: "#93C5FD",
      "Ona tili": "#FDE68A",
      Tarix: "#6EE7B7",
      Fizika: "#A5B4FC",
      Kimyo: "#6EE7B7",
      "Ingliz tili": "#FDBA74",
    }),
    []
  );

  // 🔹 Fetch schedule
  useEffect(() => {
    if (classId) dispatch(fetchSchedulesThunk({ classId }));
  }, [dispatch, classId]);

  const schedule = schedules?.[0];
  const weeks = schedule?.schedule || [];

  // 🔹 Формируем события календаря
  const events = useMemo(() => {
    if (!weeks.length) return [];
    return weeks.flatMap((week) =>
      week.days.flatMap((day) =>
        day.lessons.map((lesson) => ({
          title: `${lesson.scienceName} (${lesson.teacherName})`,
          start: `${day.date}T${lesson.startTime}`,
          end: `${day.date}T${lesson.endTime}`,
          backgroundColor: subjectColors[lesson.scienceName] || "#EDE9FE",
          borderColor: subjectColors[lesson.scienceName] || "#7C3AED",
          textColor: "#111827",
        }))
      )
    );
  }, [weeks, subjectColors]);

  // 🔹 Определяем текущую неделю
  useEffect(() => {
    if (!weeks.length || !calendarRef.current) return;
    const api = calendarRef.current.getApi();
    const today = new Date();

    const currentIndex = weeks.findIndex(
      (w) => today >= new Date(w.weekStart) && today <= new Date(w.weekEnd)
    );

    const targetIndex = currentIndex !== -1 ? currentIndex : 0;
    const targetDate = new Date(weeks[targetIndex].weekStart);

    requestAnimationFrame(() => {
      api.gotoDate(targetDate);
      setActiveWeekIndex(targetIndex);
    });
  }, [weeks]);

  // 🔹 Обновление недели при перелистывании
  const handleDatesSet = (arg) => {
    const index = weeks.findIndex(
      (week) =>
        new Date(arg.start) <= new Date(week.weekEnd) &&
        new Date(arg.end) >= new Date(week.weekStart)
    );
    if (index !== -1 && index !== activeWeekIndex) {
      setActiveWeekIndex(index);
    }
  };

  // 🔹 Свап уроков
  const handleSwapLessons = async (data) => {
    if (!schedule?._id || activeWeekIndex === null) return;

    const currentWeek = structuredClone(schedule.schedule[activeWeekIndex]);
    const fromDay = currentWeek.days.find((d) => d.day === data.fromDay);
    const toDay = currentWeek.days.find((d) => d.day === data.toDay);

    if (!fromDay || !toDay) return;

    const swapLessons = (dayA, idxA, dayB, idxB) => {
      const tmp = {
        scienceName: dayA.lessons[idxA].scienceName,
        teacherName: dayA.lessons[idxA].teacherName,
      };
      dayA.lessons[idxA].scienceName = dayB.lessons[idxB].scienceName;
      dayA.lessons[idxA].teacherName = dayB.lessons[idxB].teacherName;
      dayB.lessons[idxB].scienceName = tmp.scienceName;
      dayB.lessons[idxB].teacherName = tmp.teacherName;
    };

    const fromIdx = fromDay.lessons.findIndex(
      (l) => l.scienceName === data.fromLesson
    );
    const toIdx = toDay.lessons.findIndex(
      (l) => l.scienceName === data.toLesson
    );

    if (fromIdx === -1 || toIdx === -1) return;

    swapLessons(fromDay, fromIdx, toDay, toIdx);

    const payload = {
      isAll: false,
      week: currentWeek,
    };

    try {
      await dispatch(updateScheduleThunk({ id: schedule._id, data: payload }));
      toast.success(t("singleSchedule.swapSuccess"));
      await dispatch(fetchSchedulesThunk({ classId }));
    } catch (err) {
      toast.error(t("singleSchedule.swapError"));
      console.error(err);
    } finally {
      setModalOpen(false);
    }
  };

  const currentWeek = weeks[activeWeekIndex] || null;

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: t("singleSchedule.breadcrumbsMain"), to: "/home/schedule" },
          { label: `${classId}-sinf` },
        ]}
      />

      {/* 🔹 Верхняя панель */}
      <div className={styles.topBar}>
        {currentWeek && (
          <div className={styles.weekInfo}>
            <strong>
              {t("singleSchedule.weekNumber", { num: currentWeek.weekNumber })}
            </strong>
            <span>
              {t("singleSchedule.weekRange", {
                start: currentWeek.weekStart,
                end: currentWeek.weekEnd,
              })}
            </span>
          </div>
        )}

        {role !== ROLES.TEACHER && (
          <div className={styles.actions}>
            <button
              className={styles.swapBtn}
              onClick={() => setModalOpen(true)}
              disabled={activeWeekIndex === null}
            >
              <FiRepeat /> {t("singleSchedule.swapLessons")}
            </button>
            <button
              className={styles.refreshBtn}
              onClick={() => navigate(`/home/schedule/${classId}/edit`)}
            >
              <FiRefreshCw /> {t("singleSchedule.rebuildSchedule")}
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Модалка */}
      {role !== ROLES.TEACHER && currentWeek && (
        <SwapLessonModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          schedule={currentWeek}
          onSave={handleSwapLessons}
        />
      )}

      {/* 🔹 Контент */}
      <div className={styles.calendarWrapper}>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className={styles.error}>❌ {t("singleSchedule.error")}</p>
        ) : !schedule ? (
          <p className={styles.empty}>⚠️ {t("singleSchedule.notFound")}</p>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            locale="uz"
            initialView="timeGridWeek"
            height="calc(100vh - 190px)"
            headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
            nowIndicator
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            firstDay={1}
            slotLabelInterval="00:30"
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
            dayHeaderFormat={{ weekday: "short", day: "numeric" }}
            events={events}
            datesSet={handleDatesSet}
            eventContent={(arg) => (
              <div className={styles.eventBox}>
                <div className={styles.subject}>{arg.event.title.split("(")[0]}</div>
                <div className={styles.teacher}>
                  {arg.event.title.split("(")[1]?.replace(")", "")}
                </div>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SingleSchedulePage;