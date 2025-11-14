// src/pages/DashboardPages/FinancePage/components/PaymentsTable/PaymentsTable.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Button, Input, Space, Segmented, message } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  MessageOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./PaymentsTable.module.scss";
import CreatePaymentModal from "./CreatePaymentModal/CreatePaymentModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchStudentsBalance,
} from "../../../../App/Api/transactions/transactionsSlice";
import SendSmsModal from "./SendSmsModal/SendSmsModal";
import { useTranslation } from "react-i18next";

// 👈 Yangi komponentlar importi
import BalanceTable from "./BalanceTable/BalanceTable";
import TransferTable from "./TransferTable/TransferTable";
import { sendBulkSmsThunk } from "../../../../App/Api/Sms/smsSlice";

const PaymentsTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    list,
    loading,
    studentsBalanceList,
    studentsBalanceTotal,
    balanceLoading,
  } = useSelector((state) => state.transaction);

  // 🔹 Holat Boshqaruvi
  const [activeTab, setActiveTab] = useState("balance");
  const [status, setStatus] = useState(t("payments.status.all"));
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [balanceStatus, setBalanceStatus] = useState("all");
  const [balanceSearch, setBalanceSearch] = useState("");
  const [balancePage, setBalancePage] = useState(1);
  const [balanceLimit, setBalanceLimit] = useState(10);
  const [transferStatus, setTransferStatus] = useState("all");
  const [transferSearch, setTransferSearch] = useState("");
  const [sendingBulk, setSendingBulk] = useState(false);

  const studentsList = useMemo(
    () => list.map((item) => item.student).filter(Boolean),
    [list]
  );

  const classList = useMemo(
    () => [
      ...new Set(list.map((item) => item.student?.class?.[0]).filter(Boolean)),
    ],
    [list]
  );

  useEffect(() => {
    if (activeTab !== "balance") return;
  
    const payload = {
      search: balanceSearch || "",
      balanceFilter:
        balanceStatus === "paid"
          ? "positive"
          : balanceStatus === "not-paid"
          ? "negative"
          : "",
      page: balancePage,
      limit: balanceLimit,
    };
  
    if (selectedClass) payload.classId = selectedClass;
  
    dispatch(fetchStudentsBalance(payload));
  }, [
    dispatch,
    selectedClass,
    balanceSearch,
    balanceStatus,
    balancePage,
    balanceLimit,
    activeTab,
  ]);
  
  const paymentTypeMap = useMemo(
    () => ({
      cash: t("paymentTypes.cash"),
      bank: t("paymentTypes.bank"),
      uzum: t("paymentTypes.uzum"),
      click: t("paymentTypes.click"),
      payme: t("paymentTypes.payme"),
    }),
    [t]
  );

  const openPaymentModal = (student) => {
    setSelectedStudent(student);
    setModalMode("create");
    setSelectedPayment(null);
    setOpen(true);
  };
  const handleView = (record) => {
    setModalMode("view");
    setSelectedPayment(record);
    setOpen(true);
  };
  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setSelectedPayment(record);
    setOpen(true);
  };
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedPayment(null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
      message.success(t("payments.deleteSuccess"));
      dispatch(fetchTransactions({ page: 1, limit: 10 }));
    } catch (err) {
      message.error(t("payments.deleteError"));
    }
  };
  const handleSubmit = async (values) => {
    try {
      if (modalMode === "create") {
        await dispatch(createTransaction(values)).unwrap();
        message.success(t("payments.createSuccess"));
      } else if (modalMode === "edit" && selectedPayment?._id) {
        await dispatch(
          updateTransaction({ id: selectedPayment._id, data: values })
        ).unwrap();
        message.success(t("payments.updateSuccess"));
      }
  
      setOpen(false);
  
      // 🔹 HOZIRGI TABGA MOS API CHAQiRISH
      if (activeTab === "balance") {
        const payload = {
          search: balanceSearch || "",
          balanceFilter:
            balanceStatus === "paid"
              ? "positive"
              : balanceStatus === "not-paid"
              ? "negative"
              : "",
          page: balancePage,
          limit: balanceLimit,
        };
        if (selectedClass) payload.classId = selectedClass;
  
        dispatch(fetchStudentsBalance(payload));
      } else {
        dispatch(fetchTransactions({ page: 1, limit: 10 }));
      }
    } catch (err) {
      console.error(err);
      message.error(t("payments.saveError"));
    }
  };
  
  const openSmsModal = (fromIcon = false) => {
    // 🟢 Agar icon orqali chaqirilsa — darhol ochamiz
    if (fromIcon) {
      setSmsModalOpen(true);
      return;
    }

    // 🟡 Agar icon emas, checkbox orqali chaqirilsa
    if (selectedRowKeys.length === 0) {
      message.warning(t("payments.noSelectionWarning"));
      return;
    }

    setSmsModalOpen(true);
  };


  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (activeTab === "balance") setBalanceSearch(value);
    else setTransferSearch(value);
  };
  // 🔹 Qidiruv va filter (Ma'lumotlar bu yerda filter qilinadi)
  const filteredData = useMemo(() => {
    const currentList = list; // kerak bo‘lsa, keyinchalik har tab uchun boshqa list bo‘lishi mumkin
    const currentSearch =
      activeTab === "balance" ? balanceSearch : transferSearch;
    const currentStatus =
      activeTab === "balance" ? balanceStatus : transferStatus;
  
    return currentList.filter((item) => {
      const fullName = `${item.student?.firstName ?? ""} ${
        item.student?.lastName ?? ""
      }`.toLowerCase();
      const searchText = currentSearch.toLowerCase();
  
      const matchSearch =
        fullName.includes(searchText) ||
        item.student?.phone?.includes(searchText);
  
      const matchStatus =
        currentStatus === "all" || item.status === currentStatus;
  
      return matchSearch && matchStatus;
    });
  }, [
    list,
    balanceSearch,
    balanceStatus,
    transferSearch,
    transferStatus,
    activeTab,
  ]);
  return (
    <div className={styles.wrapper}>
      {/* ===== TAB BILAN HEADERNI BIRLASHTIRISH ===== */}
      <div className={styles.topbar}>
        <div className={styles.left}>
          <Segmented
            options={[
              { label: t("tabs.balance"), value: "balance" },
              { label: t("tabs.transfers"), value: "transfers" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            style={{ marginRight: 24 }}
          />

          <Input
            placeholder={t("payments.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={activeTab === "balance" ? balanceSearch : transferSearch}
            onChange={handleSearchChange}
            className={styles.search}
          />
        </div>

        <Space>
          <Button icon={<DownloadOutlined />}>{t("payments.export")}</Button>

          {activeTab === "balance" && ( // Faqat Balans tabida
            <Button
              icon={<MessageOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={openSmsModal}
            >
              {t("payments.sendSms")}
            </Button>
          )}

          {activeTab != "balance" && ( // Faqat Balans tabida
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              {t("payments.addPayment")}
            </Button>
          )}

          <CreatePaymentModal
            open={open}
            mode={modalMode}
            data={selectedPayment}
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
            loading={loading}
            selectedStudent={selectedStudent}
          />
        </Space>
      </div>

      {/* ===== Jadvallar Kontentini Dinamik Ko'rsatish ===== */}
      {activeTab === "balance" ? (
        <BalanceTable
          data={studentsBalanceList}
          total={studentsBalanceTotal}
          loading={balanceLoading}
          status={balanceStatus}
          onStatusChange={setBalanceStatus}
          search={balanceSearch}
          onSearchChange={setBalanceSearch}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          page={balancePage}
          onPageChange={setBalancePage}
          limit={balanceLimit}
          onLimitChange={setBalanceLimit}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          openSmsModal={openSmsModal}
          paymentTypeMap={paymentTypeMap}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          openPaymentModal={openPaymentModal}
        />
      ) : (
        <TransferTable
          status={transferStatus}
          setStatus={setTransferStatus}
          search={transferSearch}
          setSearch={setTransferSearch}
          data={filteredData}
          loading={loading}
          paymentTypeMap={paymentTypeMap}
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onSendSms={(recordId) => {
            setSelectedRowKeys([recordId]);
            setSmsModalOpen(true);
          }}
          selectedPaymentType={selectedPaymentType}
          setSelectedPaymentType={setSelectedPaymentType}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          studentsList={studentsList}
          classList={classList}
        />
      )}

      {/* ===== SMS MODAL ===== */}

      <SendSmsModal
        open={smsModalOpen}
        onCancel={() => {
          setSmsModalOpen(false);
          setSelectedRowKeys([]);
          setSelectedStudent(null);
        }}
        receivers={
          selectedStudent
            ? [selectedStudent?.phone]
            : studentsBalanceList
                .filter((item) => selectedRowKeys.includes(item._id))
                .map((item) => item?.phone)
                .filter(Boolean)
        }
      />
    </div>
  );
};

export default PaymentsTable;
