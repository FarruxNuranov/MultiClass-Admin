// src/routes/Routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { ROLES } from "../config/roles";
import { FEATURES } from "../config/features";

// Layouts
import AuthLayout from "../Layout/Auth/AuthLayout";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout";
import StudentLayout from "../Layout/Student/StudentLayout";

// Auth pages
import LoginPage from "../pages/AuthPages/Login/LoginPage";
import RegisterPage from "../pages/AuthPages/Registration/RegisterPage";
import ForgotPasswordPage from "../pages/AuthPages/ForgotPassword copy/ForgotPassword";

// Dashboard pages
import DashboardHome from "../pages/DashboardPages/DashboardHome/DashboardHome";
import TeacherDashboard from "../pages/DashboardPages/TeacherDashboard/TeacherDashboard";
import SchedulePage from "../pages/DashboardPages/SchedulePage/SchedulePage";
import SingleSchedulePage from "../pages/DashboardPages/SchedulePage/SingleSchedulePage/SingleSchedulePage";
import EditSchedulePage from "../pages/DashboardPages/SchedulePage/EditSchedulePage/EditSchedulePage";
import EditSingleSchedulePage from "../pages/DashboardPages/SchedulePage/SingleSchedulePage/EditSingleSchedulePage/EditSingleSchedulePage";
import TeacherSchedulePage from "../pages/DashboardPages/TeacherSchedulePage/TeacherSchedulePage";

import AttendancePage from "../pages/DashboardPages/AttendancePage/AttendancePage";
import SingleAttendancePage from "../pages/DashboardPages/AttendancePage/SingleAttendancePage/SingleAttendancePage";

import LessonPlanPage from "../pages/DashboardPages/LessonPlanPage/LessonPlanPage";
import SingleLessonPlanPage from "../pages/DashboardPages/LessonPlanPage/SingleLessonPlanPage/SingleLessonPlanPage";
import LessonDetailsPage from "../pages/DashboardPages/LessonPlanPage/LessonDetailsPage/LessonDetailsPage";
import LessonGradesPage from "../pages/DashboardPages/LessonPlanPage/LessonGradesPage/LessonGradesPage";
import CreateLesson from "../pages/DashboardPages/LessonPlanPage/SingleLessonPlanPage/CreateLesson/CreateLesson";

import StudentsPage from "../pages/DashboardPages/StudentsPage/StudentsPage";
import SingleStudentPage from "../pages/DashboardPages/StudentsPage/SingleStudentPage/SingleStudentPage";
import CreateStudent from "../pages/DashboardPages/StudentsPage/CreateStudent/CreateStudent";

import ParentsPage from "../pages/DashboardPages/ParentsPage/ParentsPage";
import SingleParentPage from "../pages/DashboardPages/ParentsPage/SingleParentPage/SingleParentPage";
import CreateParent from "../pages/DashboardPages/ParentsPage/CreateParent/CreateParent";

import StaffPage from "../pages/DashboardPages/StaffPage/StaffPage";
import SingleStaffPage from "../pages/DashboardPages/StaffPage/SingleStaffPage/SingleStaffPage";
import CreateTeacher from "../pages/DashboardPages/StaffPage/CreateTeacher/CreateTeacher";

import ReportsPage from "../pages/DashboardPages/ReportsPage/ReportsPage";
import FinancePage from "../pages/DashboardPages/FinancePage/FinancePage";
import MessagesPage from "../pages/DashboardPages/MessagesPage/MessagesPage";
import SingleAnnouncementPage from "../pages/DashboardPages/MessagesPage/SingleAnnouncement/SingleAnnouncementPage";
import CreateAnnouncementPage from "../pages/DashboardPages/MessagesPage/CreateAnnouncement/CreateAnnouncement";
import SettingsPage from "../pages/DashboardPages/SettingsPage/SettingsPage";
import SupportPage from "../pages/DashboardPages/SupportPage/SupportPage";

// Student zone
import StudentDashboard from "../pages/Student/StudentDashboard/StudentDashboard";
import MyHomework from "../pages/Student/MyHomework/MyHomework";
import SingleHomework from "../pages/Student/MyHomework/SingleHomework/SingleHomework";
import LectureDetail from "../pages/Student/LectureDetail/LectureDetail";
import GradesPage from "../pages/Student/Grades/GradesPage";
import ProfilePage from "../pages/Student/Profile/ProfilePage";
import ScheduleStudentPage from "../pages/Student/Schedule/ScheduleStudentPage";
import VerificationSent from "../pages/AuthPages/VerificationSent/VerificationSent";
import ResetPassword from "../pages/AuthPages/ResetPassword/ResetPassword";
import SelectRolePage from "../pages/AuthPages/SelectRolePage/SelectRolePage";
import ParentEdit from "../pages/DashboardPages/ParentsPage/SingleParentPage/ParentEdit/ParentEdit";
import StudentEdit from "../pages/DashboardPages/StudentsPage/SingleStudentPage/StudentEdit/StudentEdit";
import StaffEdit from "../pages/DashboardPages/StaffPage/SingleStaffPage/StaffEdit/StaffEdit";

// ==========================================================
// 🔧 Feature Flags (включение / выключение разделов)
// Управляются из ../config/features
// ==========================================================

// ==========================================================
// 🔹 Router Configuration
// ==========================================================
export const router = createBrowserRouter([
  // 🔹 Auth
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "verification", element: <VerificationSent /> },
      { path: "resetpassword", element: <ResetPassword /> },
      { path: "select-role", element: <SelectRolePage /> },
    ],
  },

  // 🔹 Home (приватная зона)
  {
    path: "/home",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          // --- Dashboard ---
          {
            path: "dashboard",
            element: (
              <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]} />
            ),
            children: [{ index: true, element: <DashboardHome /> }],
          },

          // --- Teacher Dashboard ---
          {
            path: "teacher",
            element: <PrivateRoute allowedRoles={[ROLES.TEACHER]} />,
            children: [{ index: true, element: <TeacherDashboard /> }],
          },

          // --- Schedule ---
          ...(FEATURES.SCHEDULE
            ? [
                {
                  path: "schedule",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}
                    />
                  ),
                  children: [{ index: true, element: <SchedulePage /> }],
                },
                {
                  path: "schedule/:id",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}
                    />
                  ),
                  children: [{ index: true, element: <SingleSchedulePage /> }],
                },
                {
                  path: "schedule/edit",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <EditSchedulePage /> }],
                },
                {
                  path: "schedule/:id/edit",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [
                    { index: true, element: <EditSingleSchedulePage /> },
                  ],
                },
                {
                  path: "teacherschedule",
                  element: <PrivateRoute allowedRoles={[ROLES.TEACHER]} />,
                  children: [{ index: true, element: <TeacherSchedulePage /> }],
                },
              ]
            : []),

          // --- Attendance ---
          ...(FEATURES.ATTENDANCE
            ? [
                {
                  path: "attendance",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <AttendancePage /> }],
                },
                {
                  path: "attendance/:id",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <SingleAttendancePage /> }],
                },
              ]
            : []),

          // --- Lesson Plan ---
          ...(FEATURES.LESSON_PLAN
            ? [
                {
                  path: "lesson-plan",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <LessonPlanPage /> }],
                },
                {
                  path: "lesson-plan/:id",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <SingleLessonPlanPage /> }],
                },
                {
                  path: "lesson-plan/:id/create",
                  element: <PrivateRoute allowedRoles={[ROLES.TEACHER]} />,
                  children: [{ index: true, element: <CreateLesson /> }],
                },
                {
                  path: "lesson-plan/:id/details/:topicId",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <LessonDetailsPage /> }],
                },
                {
                  path: "lesson-plan/:id/:topicId/grades",
                  element: (
                    <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
                  ),
                  children: [{ index: true, element: <LessonGradesPage /> }],
                },
              ]
            : []),

          // --- Students ---
          ...(FEATURES.STUDENTS
            ? [
                {
                  path: "students",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}
                    />
                  ),
                  children: [{ index: true, element: <StudentsPage /> }],
                },
                {
                  path: "students/:id",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <SingleStudentPage /> }],
                },
                {
                  path: "students/create",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <CreateStudent /> }],
                },
                {
                  path: "students/:id/edit",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <StudentEdit /> }],
                },
              ]
            : []),

          // --- Parents ---
          ...(FEATURES.PARENTS
            ? [
                {
                  path: "parents",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}
                    />
                  ),
                  children: [{ index: true, element: <ParentsPage /> }],
                },
                {
                  path: "parents/:id",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <SingleParentPage /> }],
                },
                {
                  path: "parents/create",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <CreateParent /> }],
                },
                {
                  path: `parents/:id/edit`,
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <ParentEdit /> }],
                },
              ]
            : []),

          // --- Staff ---
          ...(FEATURES.STAFF
            ? [
                {
                  path: "staff",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}
                    />
                  ),
                  children: [{ index: true, element: <StaffPage /> }],
                },
                {
                  path: "staff/:id",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <SingleStaffPage /> }],
                },
                {
                  path: "staff/create",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <CreateTeacher /> }],
                },
                {
                  path: "staff/:id/edit",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <StaffEdit /> }],
                },
              ]
            : []),

          // --- Reports ---
          ...(FEATURES.REPORTS
            ? [
                {
                  path: "reports",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <ReportsPage /> }],
                },
              ]
            : []),

          // --- Finance ---
          ...(FEATURES.FINANCE
            ? [
                {
                  path: "finance",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <FinancePage /> }],
                },
              ]
            : []),

          // --- Messages ---
          ...(FEATURES.MESSAGES
            ? [
                {
                  path: "messages",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]}
                    />
                  ),
                  children: [{ index: true, element: <MessagesPage /> }],
                },
                {
                  path: "messages/create",
                  element: <PrivateRoute allowedRoles={[ROLES.ADMIN]} />,
                  children: [{ index: true, element: <CreateAnnouncementPage /> }],
                },
                {
                  path: "messages/:id",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]}
                    />
                  ),
                  children: [{ index: true, element: <SingleAnnouncementPage /> }],
                },
              ]
            : []),

          // --- Settings / Support ---
          {
            path: "settings",
            element: (
              <PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />
            ),
            children: [{ index: true, element: <SettingsPage /> }],
          },
          ...(FEATURES.SUPPORT
            ? [
                {
                  path: "support",
                  element: (
                    <PrivateRoute
                      allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]}
                    />
                  ),
                  children: [{ index: true, element: <SupportPage /> }],
                },
              ]
            : []),
        ],
      },
{
  path: "*",
  element: <Navigate to="/home/dashboard" replace />,
},
      // --- Student zone (Student / Parent) ---
      {
        path: "student",
        element: <PrivateRoute allowedRoles={[ROLES.STUDENT, ROLES.PARENT]} />,
        children: [
          {
            path: "",
            element: <StudentLayout />,
            children: [
              { index: true, element: <StudentDashboard /> },
              { path: "homework", element: <MyHomework /> },
              { path: "homework/:id", element: <SingleHomework /> },
              { path: "homework/:id/student", element: <LectureDetail /> },
              { path: "schedule/student", element: <ScheduleStudentPage /> },
              { path: "grades", element: <GradesPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
            
          },
        ],
        
      },
    ],
  },
]);