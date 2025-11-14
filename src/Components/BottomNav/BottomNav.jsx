import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.scss";
import { FiHome, FiBook,  FiUser, FiCalendar } from "react-icons/fi";

const navItems = [
  { to: "/home/student", label: "Asosiy", icon: <FiHome size={20} /> },
  { to: "/home/student/schedule/student", label: "Dars jadvali", icon: <FiCalendar size={20} /> },
  { to: "/home/student/grades", label: "Baholar", icon: <FiBook size={20} /> },
  { to: "/home/student/profile", label: "Profil", icon: <FiUser size={20} /> },
];

const BottomNav = () => {
  return (
    <div className={styles.bottomNav}>
      {navItems.map((item, idx) => (
        <NavLink
          key={idx}
          to={item.to}
          end={item.to === "/home/student"}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;