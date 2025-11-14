import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/students";

export async function fetchStudentsApi({
  search = "",
  classId = "",
  page = 1,
  limit = 100,
  branchId = "",
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (classId) params.append("class", classId);
  if (branchId) params.append("branch", branchId); // ✅ правильное имя параметра
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

export async function fetchStudentByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

export async function createStudentApi(studentData) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

export async function updateStudentApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudentApi(id) {
  const res = await authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res || true;
}
