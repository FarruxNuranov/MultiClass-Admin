// src/Components/Breadcrumbs/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Breadcrumbs.module.scss";

const Breadcrumbs = ({ extraLabel }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  // 🔹 Маппинг маршрутов с ключами i18n
  const routeNameMap = {
    "/home/lesson-plan/:id/:topicId/grades": t("breadcrumbs.grades"),
    "/home/students": t("breadcrumbs.students"),
    "/home/students/create": t("breadcrumbs.studentCreate"),
    "/home/students/:id": t("breadcrumbs.studentDetails"),
    "/home/staff": t("breadcrumbs.teachers"),
    "/home/staff/create": t("breadcrumbs.teacherCreate"),
    "/home/staff/:id": t("breadcrumbs.teacherDetails"),
    "/home/parents": t("breadcrumbs.parents"),
    "/home/parents/create": t("breadcrumbs.parentCreate"),
    "/home/parents/:id": t("breadcrumbs.parentDetails"),
    "/home/lesson-plan": t("breadcrumbs.lessonPlan"),
    "/home/lesson-plan/:id": t("breadcrumbs.lessonDetails"),
    "/home/schedule": t("breadcrumbs.schedule"),
    "/home/schedule/:id": t("breadcrumbs.scheduleDetails"),
    "/home/reports": t("breadcrumbs.reports"),
    "/home/finance": t("breadcrumbs.finance"),
    "/home/messages": t("breadcrumbs.messages"),
    "/home/settings": t("breadcrumbs.settings"),
    "/home/support": t("breadcrumbs.support"),
    "/home/attendance": t("breadcrumbs.attendance"),
  };

  return (
    <nav className={styles.breadcrumbs}>
      <ul>
        {pathnames.map((value, index) => {
          if (value === "home") return null;
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          let label = routeNameMap[to];
          if (!label) {
            // Проверка динамических путей
            const matchedDynamic = Object.keys(routeNameMap).find((key) => {
              const pattern = key.replace(/:[^/]+/g, "[^/]+");
              return new RegExp(`^${pattern}$`).test(to);
            });
            if (matchedDynamic) label = routeNameMap[matchedDynamic];
          }

          if (!label) {
            // fallback — если нет совпадения
            if (/^[0-9a-f]{8,}$/i.test(value)) {
              if (location.pathname.includes("students"))
                label = t("breadcrumbs.studentDetails");
              else if (location.pathname.includes("parents"))
                label = t("breadcrumbs.parentDetails");
              else if (location.pathname.includes("staff"))
                label = t("breadcrumbs.teacherDetails");
              else label = t("breadcrumbs.details");
            } else {
              label = value.charAt(0).toUpperCase() + value.slice(1);
            }
          }

          return (
            <li key={to} className={isLast ? styles.active : ""}>
              {isLast ? <span>{label}</span> : <Link to={to}>{label}</Link>}
            </li>
          );
        })}

        {extraLabel && <li className={styles.active}>{extraLabel}</li>}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;