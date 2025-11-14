// src/routes/PrivateRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLES } from "../config/roles";
import { FEATURES } from "../config/features";

// 🔧 Feature Flags (управление доступом к разделам)

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { token, user } = useSelector((s) => s.auth);
  const location = useLocation();

  // 1️⃣ Нет токена → на логин
  if (!token && !localStorage.getItem("token")) {
  
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Определяем роль пользователя
  const role = user?.role?.title || localStorage.getItem("role");

  // 3️⃣ Проверка отключённых разделов (фич-флаги)
  const disabledSections = {
    "/home/students": !FEATURES.STUDENTS,
    "/home/parents": !FEATURES.PARENTS,
    "/home/staff": !FEATURES.STAFF,
    "/home/finance": !FEATURES.FINANCE,
    "/home/reports": !FEATURES.REPORTS,
    "/home/messages": !FEATURES.MESSAGES,
    "/home/support": !FEATURES.SUPPORT,
    "/home/lesson-plan": !FEATURES.LESSON_PLAN,
    "/home/attendance": !FEATURES.ATTENDANCE,
    "/home/schedule": !FEATURES.SCHEDULE, // ✅ расписание теперь тоже контролируется
    "/home/teacher-schedule": !FEATURES.SCHEDULE,
  };

  // Проверяем: если текущий путь попадает в отключённый раздел → редиректим
  const isFeatureDisabled = Object.entries(disabledSections).some(
    ([path, disabled]) => location.pathname.startsWith(path) && disabled
  );

  if (isFeatureDisabled) {
    console.warn("🚫 Access denied: feature is disabled →", location.pathname);
    return <Navigate to="/home/dashboard" replace />;
  }

  // 4️⃣ Админ и супер-админ → полный доступ
  if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
    return <Outlet />;
  }

  // 5️⃣ Проверка на разрешённые роли
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === ROLES.TEACHER && location.pathname !== "/home/teacher") {
      return <Navigate to="/home/teacher" replace />;
    }
    if (
      (role === ROLES.STUDENT || role === ROLES.PARENT) &&
      location.pathname !== "/home/student"
    ) {
      return <Navigate to="/home/student" replace />;
    }
    if (
      (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) &&
      location.pathname !== "/home/dashboard"
    ) {
      return <Navigate to="/home/dashboard" replace />;
    }
  }

  // 6️⃣ Если просто /home → редиректим по роли
  if (location.pathname === "/home" || location.pathname === "/home/") {
    if (role === ROLES.TEACHER) return <Navigate to="/home/teacher" replace />;
    if (role === ROLES.STUDENT || role === ROLES.PARENT)
      return <Navigate to="/home/student" replace />;
    return <Navigate to="/home/dashboard" replace />;
  }

  // 7️⃣ Всё ок → рендерим детей
  return <Outlet />;
};

export default PrivateRoute;