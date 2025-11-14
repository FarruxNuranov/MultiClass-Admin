// src/AppTheme.jsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { router } from "./routes/Routes";
import { useThemeMode } from "./hooks/useThemeMode";

export default function AppTheme() {
  const { mode } = useThemeMode();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm:
          mode === "dark"
            ? [antdTheme.darkAlgorithm]
            : [antdTheme.defaultAlgorithm],
        token: {
          colorPrimary: "#6841C6",
          colorPrimaryHover: "#7b55d9",
          colorPrimaryActive: "#5730b8",
          colorLink: "#6841C6",
          colorLinkHover: "#7b55d9",
          borderRadius: 8,
          fontFamily: "Inter, sans-serif",
          colorText: mode === "dark" ? "#e5e7eb" : "#111827",
          colorTextSecondary: mode === "dark" ? "#9aa3af" : "#6b7280",
          colorBorder: mode === "dark" ? "#2f3541" : "#e5e7eb",
          colorBgContainer: mode === "dark" ? "#0b1220" : "#ffffff",
          colorBgElevated: mode === "dark" ? "#0b1220" : "#ffffff",
          boxShadowSecondary: mode === "dark" ? "none" : undefined,
          borderRadiusLG: 20,
        },
        components: {
          Button: {
            colorPrimary: "#6841C6",
            colorPrimaryHover: "#7b55d9",
            colorPrimaryActive: "#5730b8",
            borderRadius: 8,
            fontWeight: 600,
            controlHeight: 44,
          },
          Input: {
            borderRadius: 8,
            activeShadow: "0 0 0 2px rgba(104, 65, 198, 0.2)",
            colorBorder: mode === "dark" ? "#2f3541" : "#d9d9d9",
            colorBorderHover: "#6841C6",
          },
          Select: {
            borderRadius: 8,
            colorBorder: mode === "dark" ? "#2f3541" : "#d9d9d9",
            colorBorderHover: "#6841C6",
            optionSelectedBg: "rgba(104, 65, 198, 0.1)",
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
