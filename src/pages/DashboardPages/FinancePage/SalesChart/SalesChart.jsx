// src/pages/DashboardPages/FinancePage/components/SalesChart.jsx
import React, { useMemo } from "react";
import { Card, Space, Typography } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;
const COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#a78bfa", "#f97316", "#10b981"];

const SalesChart = ({ stats }) => {
  const { t } = useTranslation();

  // 🔹 Ma’lumotni tayyorlash
  const chartData = useMemo(() => {
    if (!stats?.byPaymentType || !Array.isArray(stats.byPaymentType)) return [];

    return stats.byPaymentType.map((item) => ({
      name: item.paymentType?.toUpperCase() || t("salesChart.unknown"),
      value: Number(item.sum) || 0,
      label: `${item.paymentType?.toUpperCase() || t("salesChart.unknown")} – ${
        item.sum?.toLocaleString() || 0
      } ${t("salesChart.currency")}`,
    }));
  }, [stats, t]);

  return (
    <Card
      bordered={false}
      style={{
        border: "1px solid var(--colors-border-border-secondary)",
        borderRadius: 16,
        background: "var(--colors-background-bg-primary)",
        height: 340,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      title={
        <Title
          level={5}
          style={{
            margin: 0,
            fontWeight: 700,
            color: "var(--colors-text-text-primary-900)",
            fontSize: 18,
          }}
        >
          {t("salesChart.title")}
        </Title>
      }
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: "8px 24px 24px",
      }}
    >
      {/* === Pie Chart === */}
      <div
        style={{
          width: 260,
          height: 220,
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="var(--colors-background-bg-primary)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Text type="secondary">{t("salesChart.noData")}</Text>
        )}
      </div>

      {/* === Legend (izohlar) === */}
      <Space direction="vertical" size={10} style={{ minWidth: 260 }}>
        {chartData.map((d, i) => (
          <Space key={d.name} size={8} align="center">
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLORS[i],
              }}
            />
            <Text style={{ color: "var(--colors-text-text-secondary-700)", fontSize: 14, lineHeight: "20px" }}>
              {d.label}
            </Text>
          </Space>
        ))}
      </Space>
    </Card>
  );
};

export default SalesChart;
