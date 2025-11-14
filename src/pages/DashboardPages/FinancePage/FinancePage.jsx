import React, { useEffect, useState, useCallback } from "react";
import styles from "./FinancePage.module.scss";
import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Row,
  Segmented,
  Space,
  Typography,
  message,
} from "antd";
import {
  DollarOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import SalesChart from "./SalesChart/SalesChart";
import PaymentsTable from "./PaymentsTable.jsx/PaymentsTable";
import {
  fetchTransactions,
  fetchTransactionById,
  updateTransaction,
  deleteTransaction,
  createTransaction,
  fetchTransactionStats,
} from "../../../App/Api/transactions/transactionsSlice";

import { getPeriodParam, handlePeriodChange } from "../../../config/config";
const { RangePicker } = DatePicker;
const { Title } = Typography;

const FinancePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [period, setPeriod] = useState(t("finance.period.30days"));
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [branchId, setBranchId] = useState(localStorage.getItem("branchId") || ""); // ✅ добавлено
  const { list, stats, loading } = useSelector((state) => state.transaction);

  // ✅ следим за изменением branchId в localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "branchId") {
        const newBranch = localStorage.getItem("branchId") || "";
        setBranchId(newBranch);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getPeriodParam = (period) => {
    switch (period) {
      case t("finance.period.24h"):
        return "24h";
      case t("finance.period.7days"):
        return "7d";
      case t("finance.period.30days"):
        return "30d";
      case t("finance.period.12months"):
        return "12m";
      default:
        return null;
    }
  };

  const fetchStats = useCallback(() => {
    const apiPeriod = getPeriodParam(period, t);
    const params = { branchId }; // ✅ добавлен филиал

    if (period === t("finance.period.custom")) {
      if (selectedRange[0] && selectedRange[1]) {
        params.from = dayjs(selectedRange[0]).format("YYYY-MM-DD");
        params.to = dayjs(selectedRange[1]).format("YYYY-MM-DD");
      } else {
        return;
      }
    } else if (apiPeriod) {
      params.period = apiPeriod;
    } else return;

    dispatch(fetchTransactionStats(params));
  }, [dispatch, period, selectedRange, branchId]);

  const loadTransactions = useCallback(() => {
    dispatch(
      fetchTransactions({
        page: 1,
        limit: 10,
        status: "",
        paymentType: "",
        currency: "",
        search: "",
        branchId, // ✅ добавлен филиал
      })
    );
  }, [dispatch, branchId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onPeriodChange = (val) => {
    handlePeriodChange(val, t, setPeriod, setSelectedRange);
  };

  const handleRangeChange = (dates) => {
    setSelectedRange(dates || [null, null]);
    if (dates && dates[0] && dates[1]) {
      setPeriod(t("finance.period.custom"));
    }
  };

  const handleViewTransaction = (id) => dispatch(fetchTransactionById(id));

  const handleUpdateTransaction = (id, data) => {
    dispatch(updateTransaction({ id, data })).then(() => {
      message.success(t("finance.messages.updated"));
      loadTransactions();
      fetchStats();
    });
  };

  const handleDeleteTransaction = (id) => {
    dispatch(deleteTransaction(id)).then(() => {
      message.success(t("finance.messages.deleted"));
      loadTransactions();
      fetchStats();
    });
  };

  const handleCreateTransaction = (data) => {
    dispatch(createTransaction(data)).then(() => {
      message.success(t("finance.messages.created"));
      loadTransactions();
      fetchStats();
    });
  };

  return (
    <div className={styles.page}>
      {/* === HEADER === */}
      <div className={styles.header}>
        <Breadcrumb items={[{ title: t("finance.breadcrumb") }]} />
      </div>

      {/* === FILTER PANEL === */}
      <div className={styles.toolbar}>
        <Segmented
          options={[
            t("finance.period.12months"),
            t("finance.period.30days"),
            t("finance.period.7days"),
            t("finance.period.24h"),
            t("finance.period.custom"),
          ]}
          value={period}
          onChange={onPeriodChange}
          size="large"
        />

        <RangePicker
          allowClear
          value={selectedRange}
          onChange={handleRangeChange}
          suffixIcon={<CalendarOutlined />}
          className={styles.range}
          format="YYYY-MM-DD"
        />
      </div>

      {/* === STATS CARDS === */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card
              className={styles.statCard}
              styles={{
                body: {
                  padding: "20px 24px",
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <div className={styles.statInner}>
                <span className={`${styles.icon} ${styles.green}`}>
                  <DollarOutlined />
                </span>
                <div>
                  <div className={styles.smallMuted}>
                    {t("finance.stats.total")}
                  </div>
                  <Title level={2} className={styles.amount}>
                    {stats?.totalSum?.toLocaleString() || 0}
                  </Title>
                </div>
              </div>
            </Card>

            <Card
              className={styles.statCard}
              styles={{
                body: {
                  padding: "20px 24px",
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <div className={styles.statInner}>
                <span className={`${styles.icon} ${styles.red}`}>
                  <MinusCircleOutlined />
                </span>
                <div>
                  <div className={styles.smallMuted}>
                    {t("finance.stats.unpaid")}
                  </div>
                  <Title level={2} className={styles.amount}>
                    {stats?.notPaid?.toLocaleString() || 0}
                  </Title>
                </div>
              </div>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={14}>
          <SalesChart stats={stats} />
        </Col>
      </Row>

      {/* === PAYMENTS TABLE === */}
      <div style={{ marginTop: 24 }}>
        <PaymentsTable
          data={list}
          loading={loading}
          onView={handleViewTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
          onCreate={handleCreateTransaction}
        />
      </div>
    </div>
  );
};

export default FinancePage;