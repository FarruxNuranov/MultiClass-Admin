import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/employees";

// 🔹 GET (barcha)
export async function fetchTeachersApi({ search = "", classId = "", branch = "", roles = "", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (roles) params.append("roles", roles);
  if (classId) params.append("class", classId);
  if (branch) params.append("branch", branch);
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

// 🔹 POST (create)
export async function createTeacherApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 GET (one)
export async function fetchTeacherByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

// 🔹 PUT (update)
export async function updateTeacherApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 🔹 DELETE
export async function deleteTeacherApi(id) {
  const res = await authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res || true;
}
