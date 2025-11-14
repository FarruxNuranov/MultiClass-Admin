import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/currency";

// 🔹 Valyuta kursini olish (GET)
export async function fetchCurrencyApi() {
  return authorizedFetch(BASE_URL, {
    method: "GET",
  });
  // Response:
  // {
  //   "data": {
  //     "rate": 12065
  //   }
  // }
}

// 🔹 Valyuta kursini yangilash (PUT)
export async function updateCurrencyApi(rate) {
  return authorizedFetch(BASE_URL, {
    method: "PUT",
    body: JSON.stringify({ rate }),
  });
  // Request body:
  // {
  //   "rate": 1
  // }
}
