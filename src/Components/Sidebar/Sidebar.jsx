import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "./Sidebar.module.scss";
import { Select, Popover } from "antd";

import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiDollarSign,
  FiMail,
  FiSettings,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiLogOut,
  FiLock,
} from "react-icons/fi";
import { LuPin } from "react-icons/lu";
import { logout } from "../../App/Api/Auth/authSlice";
import { ROLES } from "../../config/roles";
import { fetchMeThunk } from "../../App/Api/Auth/getMeSlice";
import { fetchBranches } from "../../App/Api/Branches/branchesSlice";
import { FEATURES } from "../../config/features";
import ProfileEdit from "../ProfileEdit/ProfileEdit";

// ======================================================
// 🔧 Фич-флаги (должны совпадать с Routes.jsx)
// ======================================================

const Sidebar = () => {
  const { t, i18n } = useTranslation();

  const [favorites, setFavorites] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const profileRef = useRef(null);
  const [selectedBranch, setSelectedBranch] = useState(
    localStorage.getItem("branchId") || "all"
  );
  const [branchPopoverOpen, setBranchPopoverOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const { user, loading } = useSelector((state) => state.getMe);
  const { list: branches, loading: branchesLoading } = useSelector(
    (state) => state.branches
  );
  const role = user?.role.title || localStorage.getItem("role") || "guest";
  const langCode = (i18n.language || "uz").slice(0, 2);
  const L = {
    uz: { all: "Barcha filiallar", select: "Filialni tanlang" },
    ru: { all: "Все филиалы", select: "Выберите филиал" },
    en: { all: "All branches", select: "Select a branch" },
  };
  const labels = L[langCode] || L.uz;

  // 🔹 Линки с проверкой по фичам
  const links = [
    {
      key: "dashboard",
      label: t("dashboard"),
      to: "/home/dashboard",
      icon: <FiHome size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.STUDENT, ROLES.PARENT],
      show: true,
    },
    {
      key: "teacher-dashboard",
      label: t("teacherDashboard"),
      to: "/home/teacher",
      icon: <FiBarChart2 size={20} />,
      roles: [ROLES.TEACHER],
      show: true,
    },
    {
      key: "schedule",
      label: t("schedule"),
      to: "/home/schedule",
      icon: <FiCalendar size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.STUDENT],
      show: false,
    },
    {
      key: "teacher-schedule",
      label: t("teacherSchedule"),
      to: "/home/teacherschedule",
      icon: <FiCalendar size={20} />,
      roles: [ROLES.TEACHER],
      show: true,
    },
    {
      key: "attendance",
      label: t("attendance"),
      to: "/home/attendance",
      icon: <FiUserCheck size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.TEACHER],
      show: FEATURES.ATTENDANCE,
    },
    {
      key: "students",
      label: t("students"),
      to: "/home/students",
      icon: <FiUsers size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN],
      show: FEATURES.STUDENTS,
    },
    {
      key: "parents",
      label: t("parents"),
      to: "/home/parents",
      icon: <FiUsers size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN],
      show: FEATURES.PARENTS,
    },
    {
      key: "lesson-plan",
      label: t("lessonPlan"),
      to: "/home/lesson-plan",
      icon: <FiCalendar size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.TEACHER],
      show: FEATURES.LESSON_PLAN,
    },
    {
      key: "staff",
      label: t("staff"),
      to: "/home/staff",
      icon: <FiUsers size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN],
      show: FEATURES.STAFF,
    },
    {
      key: "reports",
      label: t("reports"),
      to: "/home/reports",
      icon: <FiBarChart2 size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN],
      show: FEATURES.REPORTS,
    },
    {
      key: "finance",
      label: t("finance.breadcrumb"),
      to: "/home/finance",
      icon: <FiDollarSign size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN],
      show: FEATURES.FINANCE,
    },
    {
      key: "messages",
      label: t("messages"),
      to: "/home/messages",
      icon: <FiMail size={20} />,
      roles: [
        ROLES.SUPERADMIN,
        ROLES.ADMIN,
        ROLES.TEACHER,
        ROLES.STUDENT,
        ROLES.PARENT,
      ],
      show: FEATURES.MESSAGES,
    },
    {
      key: "settings",
      label: t("settings"),
      to: "/home/settings",
      icon: <FiSettings size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.TEACHER],
      show: true,
    },
    {
      key: "support",
      label: t("support"),
      to: "/home/support",
      icon: <FiHelpCircle size={20} />,
      roles: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.STUDENT, ROLES.PARENT],
      show: FEATURES.SUPPORT,
    },
  ];

  // 🔹 Фильтрация по роли и фичам
  const filteredLinks = links.filter(
    (link) => link.show && link.roles.includes(role)
  );

  // Избранное
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Закрытие профиля при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const toggleFavorite = (key) => {
    setFavorites((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("role");
    navigate("/login");
  };

  const openProfileEdit = () => {
    setEditProfileOpen(true);
    setOpenMenu(false);
  };

  const handleFetchProfile = () => {
    dispatch(fetchMeThunk());
  };

  const handleUpdateProfile = async () => {
    return Promise.resolve();
  };

  const handleChangePassword = async () => {
    return Promise.resolve();
  };

  const openChangePassword = () => {
    setChangePasswordOpen(true);
    setOpenMenu(false);
  };

  const handleBranchChange = (value) => {
    setSelectedBranch(value);

    if (value === "all") {
      localStorage.removeItem("branchId");
    } else {
      localStorage.setItem("branchId", value);
    }

    // 🔄 Немного задержки, чтобы localStorage точно успел обновиться
    setTimeout(() => {
      window.location.reload();
    }, 200);

    setBranchPopoverOpen(false);
  };

  const renderNavLink = (link) => {
    const isActive =
      location.pathname === link.to ||
      location.pathname.startsWith(link.to + "/");

    return (
      <NavLink
        key={link.key}
        to={link.to}
        className={() =>
          `${styles.link} ${isActive ? styles.active : ""} ${
            collapsed ? styles.collapsedLink : ""
          }`
        }
      >
        {link.icon}
        {!collapsed && link.label}
        {!collapsed && (
          <LuPin
            className={`${styles.pin} ${
              favorites.includes(link.key) ? styles.pinActive : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(link.key);
            }}
          />
        )}
      </NavLink>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* 🔹 Верх */}
      <div className={styles.top}>
        <div className={styles.logo}>
          {!collapsed && <a href="/home">MultiClass</a>}
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Основной блок */}
        <div className={styles.section}>
          {!collapsed && <p className={styles.sectionTitle}>{t("main")}</p>}
          {filteredLinks
            .filter((l) => !["settings", "support"].includes(l.key))
            .map((link) => renderNavLink(link))}
        </div>

        {/* Прочие */}
        <div className={styles.section}>
          {!collapsed && <p className={styles.sectionTitle}>{t("other")}</p>}
          {filteredLinks
            .filter((l) => ["settings", "support"].includes(l.key))
            .map((link) => renderNavLink(link))}
        </div>
      </div>

      {/* Профиль */}
      <div className={styles.profileWrapper} ref={profileRef}>
        {/* Filial selector + Языки (колонкой) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 8,

            marginTop: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            {collapsed ? (
              <Popover
                open={branchPopoverOpen}
                onOpenChange={setBranchPopoverOpen}
                trigger="click"
                placement="right"
                content={
                  <div style={{ width: 240 }}>
                    <Select
                      autoFocus
                      showSearch
                      allowClear={false}
                      placeholder={labels.select}
                      size="middle"
                      style={{ width: "100%" }}
                      value={selectedBranch}
                      loading={branchesLoading}
                      onChange={handleBranchChange}
                      options={[
                        { value: "all", label: labels.all },
                        ...(Array.isArray(branches)
                          ? branches.map((b) => ({
                              value: b._id,
                              label: b.title,
                            }))
                          : []),
                      ]}
                    />
                  </div>
                }
              >
                <button
                  type="button"
                  title={labels.select}
                  style={{
                    width: 45,
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid var(--colors-border-border-secondary)",
                    background: "var(--colors-background-bg-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <FiUsers size={18} />
                </button>
              </Popover>
            ) : (
              <Select
                size="large"
                showSearch
                placeholder={labels.select}
                style={{ width: "100%" }}
                value={selectedBranch}
                loading={branchesLoading}
                onChange={handleBranchChange}
                options={[
                  { value: "all", label: labels.all },
                  ...(Array.isArray(branches)
                    ? branches.map((b) => ({ value: b._id, label: b.title }))
                    : []),
                ]}
              />
            )}
          </div>

          <div className={styles.langSwitch}>
            {["uz", "ru", "en"].map((lang) => (
              <button
                key={lang}
                className={`${
                  collapsed ? styles.langBtnSmall : styles.langBtn
                } ${i18n.language === lang ? styles.active : ""}`}
                onClick={() => handleLanguageChange(lang)}
              >
                {collapsed ? (
                  <>
                    {lang === "uz" && "🇺🇿"}
                    {lang === "ru" && "🇷🇺"}
                    {lang === "en" && "🇬🇧"}
                  </>
                ) : (
                  <>
                    {lang === "uz" && "🇺🇿 UZ"}
                    {lang === "ru" && "🇷🇺 RU"}
                    {lang === "en" && "🇬🇧 EN"}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
        <div
          className={styles.profileCard}
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <FiUser className={styles.avatarIcon} />
          {!collapsed && (
            <div>
              {loading ? (
                <p className={styles.email}>Yuklanmoqda...</p>
              ) : (
                <>
                  <p className={styles.name}>
                    {user?.firstName || user?.lastName
                      ? `${user?.firstName ?? ""} ${
                          user?.lastName ?? ""
                        }`.trim()
                      : "Foydalanuvchi"}
                  </p>
                  <p className={styles.email}>
                    {user?.phone || "Telefon no'mer yo‘q"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
        {openMenu && !collapsed && (
          <div className={styles.profileMenu}>
            <button className={styles.menuItem} onClick={openProfileEdit}>
              <FiUser /> {t("profile")}
            </button>
            <button className={styles.menuItem} onClick={openChangePassword}>
              <FiLock /> {"Change password"}
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              <FiLogOut /> {t("logout")}
            </button>
          </div>
        )}
      </div>
      <ProfileEdit
        editProfileOpen={editProfileOpen}
        setEditProfileOpen={setEditProfileOpen}
        changePasswordOpen={changePasswordOpen}
        setChangePasswordOpen={setChangePasswordOpen}
        user={user}
        onFetchProfile={handleFetchProfile}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        profileUpdating={loading}
      />
    </aside>
  );
};

export default Sidebar;
