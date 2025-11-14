import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/branches";

// 🔹 Get all branches (pagination, search)
export async function fetchBranchesApi({ page = 1, limit = 100, search = "" } = {}) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

// 🔹 Get single branch by ID
export async function fetchBranchByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

// 🔹 Create branch
export async function createBranchApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Update branch
export async function updateBranchApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 🔹 Delete branch
export async function deleteBranchApi(id) {
  const res = await authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res || true;
}
