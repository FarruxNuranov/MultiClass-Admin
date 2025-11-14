import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/tuition-day";

// 🔹 Oylik to‘lov kunini olish
export async function getTuitionDayApi() {
  return authorizedFetch(BASE_URL, { method: "GET" });
}

// 🔹 Oylik to‘lov kunini yangilash
export async function putTuitionDayApi(data) {
  return authorizedFetch(`${BASE_URL}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
