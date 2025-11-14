// src/pages/DashboardPages/FinancePage/components/PaymentsTable/TransferTable/TransferTable.jsx
import React, { useMemo, useEffect, useState } from "react";
import { Table, Space, Tag, Tooltip, Select, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { FiEdit2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "../PaymentsTable.module.scss";
import { fetchTransactions } from "../../../../../App/Api/transactions/transactionsSlice";
import { fetchStudents } from "../../../../../App/Api/Students/studentsSlice";

const TransferTable = ({
  paymentTypeMap,
  onEdit,
  onDownload,
  selectedPaymentType,
  setSelectedPaymentType,
  selectedStudent,
  setSelectedStudent,
  selectedClass,
  setSelectedClass,
  studentsList = [],
  classList = [],
  search,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // 🌟 Local state for table data
  const {
    list: data = [],
    total = 0,
    loading = false,
  } = useSelector((state) => state.transaction ?? {});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    dispatch(
      fetchTransactions({
        paymentType: selectedPaymentType === "all" ? "" : selectedPaymentType,
        search: search || "",
        status: "",
        class: selectedClass === "all" ? "" : selectedClass,
        page,
        limit: pageSize,
      })
    );
  }, [dispatch, selectedPaymentType, search, selectedClass, page, pageSize]);

  // ======= PAYMENT COLORS =======
  const paymentColor = useMemo(
    () => ({
      [t("paymentTypes.cash")]: "green",
      [t("paymentTypes.bank")]: "gold",
      [t("paymentTypes.uzum")]: "purple",
      [t("paymentTypes.click")]: "blue",
      [t("paymentTypes.payme")]: "cyan",
    }),
    [t]
  );

  // ======= FILTER UI =======
  const filters = (
    <div>
      <Space className={styles.filters} wrap>
        <Select
          placeholder={t("payments.filter.typePlaceholder")}
          style={{ width: 180 }}
          allowClear
          value={selectedPaymentType}
          onChange={setSelectedPaymentType}
          options={[
            { label: t("payments.status.all"), value: "all" },
            ...Object.entries(paymentTypeMap).map(([key, label]) => ({
              label,
              value: key,
            })),
          ]}
        />

      </Space>
    </div>
  );

  // ======= TABLE COLUMNS =======
  const columns = useMemo(
    () => [
      {
        title: t("payments.column.student"),
        dataIndex: "student",
        render: (student) => (
          <div className={styles.studentCell}>
            <div className={styles.name}>
              {student?.lastName} {student?.firstName}
            </div>
            <div className={styles.phone}>{student?.phone}</div>
          </div>
        ),
      },
      {
        title: t("transfers.column.amount"),
        dataIndex: "price",
        render: (value, record) =>
          record?.currencyRate
            ? `$${Number(record.currencyRate).toLocaleString(
                "ru-RU"
              )} (${Number(value).toLocaleString("ru-RU")} sum)`
            : `${Number(value).toLocaleString("ru-RU")} so'm`,
      },
      {
        title: t("payments.column.paymentType"),
        dataIndex: "paymentType",
        render: (type) => {
          const translated = paymentTypeMap[type] || type;
          return (
            <Tag color={paymentColor[translated] || "default"}>
              {translated}
            </Tag>
          );
        },
      },
      {
        title: t("payments.column.class"),
        dataIndex: "student",
        render: (student) => {
          const cls = student?.class;

          if (Array.isArray(cls) && cls.length > 0) {
            const { grade, title } = cls[0];
            return `${grade || ""} ${title || ""}`.trim() || "-";
          }

          return "-";
        },
      },
      {
        title: t("payments.column.date"),
        dataIndex: "createdAt",
        render: (dateString) =>
          dateString
            ? new Date(dateString).toLocaleDateString("uz-UZ", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-",
      },
      {
        title: t("payments.column.actions"),
        align: "right",
        render: (record) => (
          <Space>
            <Tooltip title={t("payments.tooltip.edit")}>
              <Button
                type="text"
                icon={<FiEdit2 />}
                onClick={() => onEdit(record)}
                style={{ color: "var(--colors-text-text-brand-secondary-700)", fontSize: 16 }}
              />
            </Tooltip>

            <Tooltip title={t("payments.tooltip.download")}>
              <DownloadOutlined
                onClick={() => onDownload?.(record)}
                style={{ cursor: "pointer", color: "var(--success-700)", fontSize: 18 }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t, paymentTypeMap, paymentColor, onEdit, onDownload]
  );

  return (
    <>
      {filters}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} ${t(
              "payments.pagination.total"
            )}`,
        }}
        className={styles.table}
      />
    </>
  );
};

export default TransferTable;
