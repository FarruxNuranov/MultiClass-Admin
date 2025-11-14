import { authorizedFetch } from "../../../utils/authorizedFetch";

// ✅ Обязательно полный путь, если у API есть префикс
const BASE_URL = "/parents";

export async function fetchParentsAPI({
  search = "",
  page = 1,
  limit = 100,
  branchId = "",
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (branchId) params.append("branch", branchId); // ✅ только если есть branchId
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

export async function fetchParentByIdAPI(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

export async function createParentAPI(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateParentAPI(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteParentAPI(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}
