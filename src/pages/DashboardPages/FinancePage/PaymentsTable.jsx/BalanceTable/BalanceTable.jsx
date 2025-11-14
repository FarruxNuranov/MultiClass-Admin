import React, { useEffect, useMemo, useState } from "react";
import { Table, Space, Tag, Tooltip, Segmented, Select, Input } from "antd";
import { MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styles from "../PaymentsTable.module.scss";
import { fetchStudentsBalance } from "../../../../../App/Api/transactions/transactionsSlice";
import { fetchClasses } from "../../../../../App/Api/Classes/classesSlice";

const BalanceTable = ({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  openSmsModal,
  openPaymentModal,
  setSelectedStudent,
  selectedRowKeys,
  setSelectedRowKeys,
  paymentTypeMap = {},
  onClassChange,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // 🔹 Redux store
  const { studentsBalanceList, studentsBalanceTotal, balanceLoading } =
    useSelector((state) => state.transaction);

  const { items: classesList, loading: classesLoading } = useSelector(
    (state) => state.classes
  );

  // 🔹 Local state
  const [status, setStatus] = useState("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchClass, setSearchClass] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  // 🔹 Fetch classes
  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  // 🔽 FILTER UI
  const filters = (
    <div >
      <Space className={styles.filters} wrap>
        <Segmented
          options={[
            { label: t("payments.status.all"), value: "all" },
            { label: t("payments.status.paid"), value: "paid" },
            { label: t("payments.status.notPaid"), value: "not-paid" },
          ]}
          value={status}
          onChange={(val) => {
            setStatus(val);
            onStatusChange(val);
          }}
        />


        {/* 🔹 Class select */}
        <Select
          placeholder={t("payments.filter.classPlaceholder")}
          style={{ width: 220 }}
          allowClear
          value={selectedClass || null}
          loading={classesLoading}
          onChange={(val) => {
            setSelectedClass(val);
            onClassChange(val);
          }}
          options={classesList.map((c) => ({
            label: `${c.grade || ""} ${c.title || ""}`.trim(),
            value: c._id,
          }))}
        />
      </Space>
    </div>
  );

  // 🔽 Jadval ustunlari
  const columns = useMemo(
    () => [
      {
        title: t("payments.column.student"),
        key: "student",
        render: (_, record) => (
          <div className={styles.studentCell}>
            <div>
              <div className={styles.name}>
                {record.firstName} {record.lastName}
              </div>
              <div className={styles.phone}>{record.phone}</div>
            </div>
          </div>
        ),
      },
      {
        title: t("payments.column.amount"),
        dataIndex: "balance",
        key: "balance",
        render: (value, record) => {
          const numericValue = Number(value);
          let color = "var(--success-700)";
          if (numericValue < 0) color = "var(--colors-foreground-fg-error-primary)";
          else if (numericValue === 0) color = "var(--colors-brand-600)";
          return (
            <span style={{ color, fontWeight: 500 }}>
              {numericValue.toLocaleString()} {record?.currency || "UZS"}
            </span>
          );
        },
      },
      {
        title: t("payments.column.status"),
        key: "status",
        render: (_, record) => {
          const numericValue = Number(record.balance);
          const isNegative = numericValue < 0;
          const statusText = isNegative ? "To‘lanmagan" : "To‘langan";
          const color = isNegative ? "error" : "success";
          return <Tag color={color}>{statusText}</Tag>;
        },
      },
      {
        title: t("payments.column.class"),
        key: "class",
        render: (_, record) => {
          const cls = record.class?.[0];
          if (!cls) return "-";
          return `${cls.grade || ""} ${cls.title || ""}`.trim();
        },
      },
      {
        title: t("payments.column.actions"),
        key: "actions",
        align: "right",
        render: (record) => (
          <Space>
            <Tooltip title={t("payments.tooltip.addPayment")}>
              <PlusOutlined
                onClick={() => {
                  setSelectedStudent(record);
                  openPaymentModal(record);
                }}
                style={{ color: "var(--success-700)", cursor: "pointer", fontSize: 18 }}
              />
            </Tooltip>

            <Tooltip title={t("payments.tooltip.sms")}>
              <MessageOutlined
                onClick={() => {
                  setSelectedStudent(record);
                  openSmsModal(record); // faqat shu student
                }}
                style={{ color: "var(--blue-700)", cursor: "pointer", fontSize: 18 }}
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [t, paymentTypeMap]
  );

  // 🔹 RowSelection (checkboxlar)
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRows(rows); // agar obyektlar ham kerak bo‘lsa alohida state
      setSelectedRowKeys(keys); // checkboxlar uchun _id array
    },
  };

  return (
    <>
      {filters}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={studentsBalanceList}
        loading={balanceLoading}
        pagination={{
          current: page,            
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          onChange: (p, l) => {
            onPageChange(p);
            onLimitChange(l);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} ${t(
              "payments.pagination.total"
            )}`,
        }}
        rowSelection={rowSelection} // 🔹 checkbox qo‘shildi
        className={styles.table}
      />
    </>
  );
};

export default BalanceTable;
