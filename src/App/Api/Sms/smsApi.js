import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/sms";

// 🔹 Barcha SMS shablonlarini olish
export async function fetchSmsTemplatesApi({ search = "", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

// 🔹 Bitta SMS shablonni olish
export async function fetchSmsTemplateByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

// 🔹 Yangi SMS shablon yaratish
export async function createSmsTemplateApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 SMS shablonni yangilash
export async function updateSmsTemplateApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// 🔹 SMS shablonni o‘chirish
export async function deleteSmsTemplateApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

// 🔹 🔹 Yangi qo‘shildi: SMS loglarini olish
export async function fetchSmsLogsApi({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  return authorizedFetch(`/ama/logs?${params.toString()}`, { method: "GET" });
}

// 🔹 🔹 Yangi qo‘shildi: Bulk SMS yuborish
export async function sendBulkSmsApi({ phones = [], message = "" } = {}) {
  return authorizedFetch(`${BASE_URL}/send-bulk`, {
    method: "POST",
    body: JSON.stringify({ phones, message }),
  });
}
