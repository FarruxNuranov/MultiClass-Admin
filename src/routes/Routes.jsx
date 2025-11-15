// src/routes/Routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../Layout/Auth/AuthLayout";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout";

// Pages
import LoginPage from "../pages/AuthPages/Login/LoginPage";
import HomePage from "../pages/DashboardPages/Home/HomePage";
import SchoolsPage from "../pages/DashboardPages/Schools/SchoolsPage";
import SettingsPage from "../pages/DashboardPages/Settings/SettingsPage";
import CreateSchool from "../pages/DashboardPages/Schools/createScool/createSchool";
import SingleSchool from "../pages/DashboardPages/Schools/singleSchool/singleSchool";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
  {
    path: "/home",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "schools",
        element: <SchoolsPage />,
      },
      { path: "settings", element: <SettingsPage /> },
      { path: "schools/create", element: <CreateSchool /> },
      { path: "schools/:id", element: <SingleSchool /> },
      { path: "schools/edit/:id", element: <CreateSchool /> }
    ],
  },
]);
