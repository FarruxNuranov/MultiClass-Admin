// src/pages/DashboardPages/DashboardHome/DashboardHome.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FiCalendar } from "react-icons/fi";
import styles from "./DashboardHome.module.scss";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../../App/Api/dashboard/dashboardSlice";
import { useThemeMode } from "../../../hooks/useThemeMode";

const DashboardHome = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  const { mode } = useThemeMode();

  const [activeBigFilter, setActiveBigFilter] = useState("30 days");
  const bigFilters = ["12 months", "30 days", "7 days", "24 hours"];

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // 📊 Cards API’dan
  const cards = useMemo(() => {
    return [
      {
        title: t("students"),
        amount: `${data?.totalStudents || 0} ta`,
        growth: "",
        growthPositive: true,
        color: "#22c55e",
        chartColor: "#22c55e",
      },
      {
        title: t("staff"),
        amount: `${data?.totalEmployees || 0} ta`,
        growth: "",
        growthPositive: true,
        color: "#8b5cf6",
        chartColor: "#8b5cf6",
      },
      {
        title: t("mrr"),
        amount: `${(data?.mrr || 0).toLocaleString()} so’m`,
        growth: "",
        growthPositive: true,
        color: "#3b82f6",
        chartColor: "#3b82f6",
      },
      {
        title: t("latePayments"),
        amount: `${(data?.debtSum || 0).toLocaleString()} so’m`,
        growth: "",
        growthPositive: true,
        color: "#8b5cf6",
        chartColor: "#8b5cf6",
      },
    ];
  }, [data, t]);

  // 📊 Big chart data API’dan
  const bigData = useMemo(() => {
    if (!data?.sales) return [];

    if (activeBigFilter === "30 days") {
      return data.sales.last30Days.map((d) => ({
        label: d.date,
        value: d.total,
      }));
    }
    if (activeBigFilter === "12 months") {
      return data.sales.last12Months.map((d) => ({
        label: d.month,
        value: d.total,
      }));
    }
    if (activeBigFilter === "7 days") {
      return data.sales.last7Days.map((d) => ({
        label: d.date,
        value: d.total,
      }));
    }
    if (activeBigFilter === "24 hours") {
      return data.sales.last24Hours.map((d) => ({
        label: d.hour,
        value: d.total,
      }));
    }
    return [];
  }, [activeBigFilter, data]);

  // Theme-aware colors from CSS variables
  const themeColors = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        brand: "#8b5cf6",
        border: "#e5e7eb",
        tick: "#6b7280",
        tooltipBg: "#111827",
        tooltipText: "#ffffff",
      };
    }
    const cs = getComputedStyle(document.documentElement);
    const read = (name) => cs.getPropertyValue(name).trim() || undefined;
    const brand = read("--colors-brand-600") || "#7F56D9";
    const border = read("--colors-border-border-secondary") || "#e5e7eb";
    const tick = read("--colors-text-text-quaternary-500") || "#6b7280";
    const tooltipBg = read("--colors-background-bg-primary") || "#111827";
    const tooltipText = read("--colors-text-text-primary-900") || "#ffffff";
    return { brand, border, tick, tooltipBg, tooltipText };
  }, [mode]);

  return (
    <div className={styles.page}>
      {/* 🔹 Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t("dashboard")}</h1>
      </div>

      {/* 🔹 Small cards */}
      <div className={styles.cardsGrid}>
        {cards.map((card, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.cardTop}>
              <h3>{card.title}</h3>
              {card.growth && (
                <span
                  className={`${styles.growth} ${
                    card.growthPositive ? styles.growthUp : styles.growthDown
                  }`}
                >
                  {card.growth}
                </span>
              )}
            </div>
            <p className={styles.amount}>{card.amount}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Big chart */}
      <div className={styles.bigCard}>
        <div className={styles.bigcardHeader}>
          <h3 className={styles.cardTitle}>{t("sales")}</h3>
        </div>

        <div className={styles.bigCardBody}>
          <div className={styles.bigCardTop}>
            <div className={styles.valueLeft}>
              <span className={styles.bigAmount}>
                {(bigData.reduce((sum, d) => sum + d.value, 0)).toLocaleString()} so’m
              </span>
              {/* <span className={styles.bigSubtitle}>{t("vsLast30Days")}</span> */}
            </div>

            <div className={styles.bigCardFilters}>
              {bigFilters.map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${
                    activeBigFilter === f ? styles.active : ""
                  }`}
                  onClick={() => setActiveBigFilter(f)}
                >
                  {t(f)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.bigChartBox}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={bigData}>
                <defs>
                  <linearGradient id="bigColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors.brand} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={themeColors.brand} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={themeColors.border}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: themeColors.tick }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} so’m`, "Sales"]}
                  contentStyle={{
                    background: themeColors.tooltipBg,
                    borderRadius: "6px",
                    color: themeColors.tooltipText,
                    border: `1px solid ${themeColors.border}`,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={themeColors.brand}
                  fill="url(#bigColor)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
