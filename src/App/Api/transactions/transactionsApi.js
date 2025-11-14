import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/transactions";

/**
 * 🔹 Barcha tranzaksiyalarni olish
 */
export async function fetchTransactionsApi({
  search = "",
  status = "",
  paymentType = "",
  currency = "",
  page = "",
  limit = "",
  branchId = "",
  class: classParam = "", // 🔹 JS reserved so‘zini alias qilib oldik
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (paymentType) params.append("paymentType", paymentType);
  if (currency) params.append("currency", currency);
  if (branchId) params.append("branch", branchId); // ✅ филиал bo'yicha filtrlash
  if (classParam) params.append("class", classParam);  // 🔹 API uchun class

  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, { method: "GET" });
}

/**
 * 🔹 Sinfdagi o'quvchilarning balansini olish (yangi funksiya)
 */
export async function fetchStudentsBalanceApi({
  classId = "",
  search = "",
  balanceFilter = "", // 'positive', 'negative'
  page = "",
  limit = "",
} = {}) {
  const params = new URLSearchParams();

  if (classId) params.append("class", classId);
  if (search) params.append("search", search);
  if (balanceFilter) params.append("balanceFilter", balanceFilter);

  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}/students-balance?${params.toString()}`, {
    method: "GET",
  });
}

/**
 * 🔹 ID orqali bitta tranzaksiyani olish
 */
export async function fetchTransactionByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

/**
 * 🔹 Tranzaksiya yaratish
 */
export async function createTransactionApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 🔹 Tranzaksiyani yangilash
 */
export async function updateTransactionApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * 🔹 Tranzaksiyani o'chirish
 */
export async function deleteTransactionApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

/**
 * 🔹 Tranzaksiya statistikasini olish
 */
export async function fetchTransactionStatsApi({
  period = "",
  from = "",
  to = "",
  branchId = "",
} = {}) {
  const params = new URLSearchParams();

  if (period) params.append("period", period);
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (branchId) params.append("branch", branchId); // ✅ filial bo'yicha filtrlash

  return authorizedFetch(`${BASE_URL}/stats?${params.toString()}`, {
    method: "GET",
  });
}
