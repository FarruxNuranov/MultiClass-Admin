import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Sidebar.module.scss";
import { Select, Popover } from "antd";

import {
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiLogOut,
  FiLock,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { logout } from "../../App/Api/Auth/authSlice";

import { fetchMeThunk } from "../../App/Api/Auth/getMeSlice";

import ProfileEdit from "../ProfileEdit/ProfileEdit";

// ======================================================
// 🔧 Фич-флаги (должны совпадать с Routes.jsx)
// ======================================================

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const profileRef = useRef(null);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  const { user, loading } = useSelector((state) => state.getMe);

  // 🔹 Basic navigation links grouped by section
  const links = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/home",
      icon: <FiHome size={20} />,
      section: "main",
      show: true,
    },
    {
      key: "schools",
      label: "Maktablar",
      to: "/home/schools",
      icon: <FiUsers size={20} />,
      section: "main",
      show: true,
    },
    {
      key: "settings",
      label: "Sozlamalar",
      to: "/home/settings",
      icon: <FiSettings size={20} />,
      section: "other",
      show: true,
    },
  ];

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

        {/* Asosiy */}
        <div className={styles.section}>
          {!collapsed && <p className={styles.sectionTitle}>Asosiy</p>}
          {links
            .filter((link) => link.section === "main" && link.show)
            .map((link) => renderNavLink(link))}
        </div>

        {/* Boshqa */}
        <div className={styles.section}>
          {!collapsed && <p className={styles.sectionTitle}>Boshqa</p>}
          {links
            .filter((link) => link.section === "other" && link.show)
            .map((link) => renderNavLink(link))}
        </div>
      </div>

      {/* Профиль */}
      <div className={styles.profileWrapper} ref={profileRef}>
        {/* Filial selector */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 8,

            marginTop: 8,
          }}
        ></div>
        <div
          className={styles.profileCard}
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <FiUser className={styles.avatarIcon} />
          {!collapsed && (
            <div>
              {loading ? (
                <p className={styles.email}>Loading...</p>
              ) : (
                <>
                  <p className={styles.name}>
                    {user?.firstName || user?.lastName
                      ? `${user?.firstName ?? ""} ${
                          user?.lastName ?? ""
                        }`.trim()
                      : "User"}
                  </p>
                  <p className={styles.email}>
                    {user?.phone || "Phone number is not set"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
        {openMenu && !collapsed && (
          <div className={styles.profileMenu}>
            <button className={styles.menuItem} onClick={openProfileEdit}>
              <FiUser /> Profile
            </button>
            <button className={styles.menuItem} onClick={openChangePassword}>
              <FiLock /> Change password
            </button>
            <button className={styles.menuItem} onClick={handleLogout}>
              <FiLogOut /> Logout
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
