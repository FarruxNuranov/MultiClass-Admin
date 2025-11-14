// src/utils/getToken.js

export const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  } catch (err) {
    console.error("❌ Token olishda xatolik:", err);
    return null;
  }
};