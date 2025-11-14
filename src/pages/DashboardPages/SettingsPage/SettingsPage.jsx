import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import {
  SettingOutlined,
  BookOutlined,
  TeamOutlined,
  IdcardOutlined,
  ClusterOutlined,
  MessageOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbs";
import styles from "./SettingsPage.module.scss";

import GeneralSettings from "./SettingsTabs/GeneralSettings/GeneralSettings";
import SubjectsSettings from "./SettingsTabs/SubjectsSettings/SubjectsSettings";
import ClassesSettings from "./SettingsTabs/ClassesSettings/ClassesSettings";

// ✅ Позже добавишь эти компоненты (уже есть в планах)
import PositionsSettings from "./SettingsTabs/PositionsSettings/PositionsSettings";
import BranchesSettings from "./SettingsTabs/BranchesSettings/BranchesSettings";
import SmsTemplatesSettings from "./SettingsTabs/SmsTemplatesSettings/SmsTemplatesSettings";

import {
  fetchSciences,
  createScience,
  updateScience,
  deleteScience,
} from "../../../App/Api/Sciences/sciencesSlice";

import {
  fetchClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../../../App/Api/Classes/classesSlice";
import TariffsSettings from "./SettingsTabs/Tariff/TariffsSettings";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState("general");
  const dispatch = useDispatch();

  // 🔹 Redux selectors
  const { items: subjects, loading: subjLoading } = useSelector(
    (state) => state.sciences
  );
  const { items: classes, loading: classLoading } = useSelector(
    (state) => state.classes
  );

  // 🔹 Lazy loading (загрузка только при открытии вкладки)
  useEffect(() => {
    if (activeKey === "subjects" && subjects.length === 0)
      dispatch(fetchSciences());
  }, [activeKey, subjects.length, classes.length, dispatch]);

  // === Handlers ===
  const handleAddSubject = async (title) => {
    await dispatch(createScience({ title }));
    dispatch(fetchSciences());
  };

  const handleUpdateSubject = async (id, data) => {
    await dispatch(updateScience({ id, data }));
    dispatch(fetchSciences());
  };

  const handleDeleteSubject = async (id) => {
    await dispatch(deleteScience(id));
    dispatch(fetchSciences());
  };

  const handleAddClass = async (data) => {
    await dispatch(createClass(data));
    dispatch(fetchClasses({ branch: data.branch }));
  };

  const handleUpdateClass = async (id, data) => {
    await dispatch(updateClass({ id, data }));
    dispatch(fetchClasses({ branch: data.branch }));
  };

  const handleDeleteClass = async (id, branch) => {
    await dispatch(deleteClass(id));
    dispatch(fetchClasses({ branch }));
  };

  // === Tabs list ===
  const items = [
    {
      key: "general",
      label: (
        <span>
          <SettingOutlined /> {t("settingsPage.tabs.general")}
        </span>
      ),
      children: <GeneralSettings />,
    },
    {
      key: "subjects",
      label: (
        <span>
          <BookOutlined /> {t("settingsPage.tabs.subjects")}
        </span>
      ),
      children: (
        <SubjectsSettings
          subjects={subjects}
          loading={subjLoading}
          onAdd={handleAddSubject}
          onUpdate={handleUpdateSubject}
          onDelete={handleDeleteSubject}
        />
      ),
    },
    {
      key: "classes",
      label: (
        <span>
          <TeamOutlined /> {t("settingsPage.tabs.classes")}
        </span>
      ),
      children: (
        <ClassesSettings
          classes={classes}
          loading={classLoading}
          onAdd={handleAddClass}
          onUpdate={handleUpdateClass}
          onDelete={handleDeleteClass}
        />
      ),
    },
    {
      key: "positions",
      label: (
        <span>
          <IdcardOutlined /> {t("settingsPage.tabs.positions")}
        </span>
      ),
      children: <PositionsSettings />,
    },
    {
      key: "branches",
      label: (
        <span>
          <ClusterOutlined /> {t("settingsPage.tabs.branches")}
        </span>
      ),
      children: <BranchesSettings />,
    },
    {
      key: "sms",
      label: (
        <span>
          <MessageOutlined /> {t("settingsPage.tabs.sms")}
        </span>
      ),
      children: <SmsTemplatesSettings />,
    },
    {
      key: "tariff",
      label: (
        <span>
          <DollarOutlined /> {t("settingsPage.tabs.tariff")}
        </span>
      ),
      children: <TariffsSettings />,
    },
  ];

  return (
    <div className={styles.page}>
      {/* 🔹 Breadcrumb */}
      <div className={styles.breadcrumbBox}>
        <Breadcrumbs
          items={[
            { label: t("settingsPage.breadcrumbs.title"), href: "/settings" },
          ]}
        />
      </div>

      {/* 🔹 Tabs (Ant Design) */}
      <div className={styles.tabsBox}>
        <Tabs
          tabPosition="left"
          items={items}
          activeKey={activeKey}
          onChange={setActiveKey}
          className={styles.settingsTabs}
          animated
        />
      </div>
    </div>
  );
};

export default SettingsPage;
