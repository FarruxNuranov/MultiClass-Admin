// src/App/Api/Classes/classesApi.js
import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/classes";

// ✅ GET — список всех классов (с фильтром по филиалу)
export async function fetchClassesApi({ branch = "", search = "" } = {}) {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  if (search) params.append("search", search);

  const query = params.toString() ? `?${params.toString()}` : "";
  return authorizedFetch(`${BASE_URL}${query}`, {
    method: "GET",
  });
}

// ✅ GET — список классов учителя
export async function fetchTeacherClassesApi() {
  return authorizedFetch(`${BASE_URL}/my`, { method: "GET" });
}

// ✅ POST — создать класс
export async function createClassApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ✅ PUT — обновить класс
export async function updateClassApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ✅ DELETE — удалить класс
export async function deleteClassApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}
