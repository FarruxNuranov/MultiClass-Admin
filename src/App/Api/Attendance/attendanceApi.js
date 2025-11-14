import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/attendance"; // base path — без config.apiUrl, authorizedFetch добавит

// 🔹 Получить все записи (с фильтрами: class, date, page, limit)
export async function fetchAttendanceApi(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  return authorizedFetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}

// 🔹 Получить записи по конкретному классу
export async function fetchAttendanceByClassApi(classId) {
  return authorizedFetch(`${BASE_URL}/class/${classId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}