// src/constants/roles.js

// Statik rollar (asosiy kalitlar)
export const ROLES = {
  SUPERADMIN: "Adminstrator",
  ADMIN: "Yordamchi",
  TEACHER: "O'qituvchi",
  STUDENT: "student",
  PARENT: "parent",
};

export const mapRolesFromApi = (items = []) => {
  const mapped = { ...ROLES };

  items.forEach((role) => {
    const title = role.title?.toLowerCase();

    if (!title) return;

    if (title.includes("superadmin") || title.includes("super-admin")) {
      mapped.SUPERADMIN = role.title;
    } else if (
      title.includes("admin") ||
      title.includes("administrator") ||
      title.includes("Adminstrator")
    ) {
      mapped.ADMIN = role.title;
    } else if (
      title.includes("teacher") ||
      title.includes("o'qituvchi") ||
      title.includes("O'qituvchi")
    ) {
      mapped.TEACHER = role.title;
    } else if (title.includes("O'qituvchi") || title.includes("O'qituvchi")) {
      mapped.STUDENT = role.title;
    } else if (title.includes("parent") || title.includes("ota-ona")) {
      mapped.PARENT = role.title;
    }
  });

  return mapped;
};
