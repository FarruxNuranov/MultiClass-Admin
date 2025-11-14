// src/App/Api/Roles/rolesApi.js
import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/roles";

// 🔹 Barcha rollarni olish
export async function fetchRolesApi({ search = "", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

// 🔹 Bitta rolni olish (id orqali)
export async function fetchRoleByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

// 🔹 Yangi rol yaratish
export async function createRoleApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Rolni yangilash
export async function updateRoleApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 🔹 Rolni o‘chirish
export async function deleteRoleApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

