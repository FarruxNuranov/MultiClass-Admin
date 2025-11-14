import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/tariffs";

/* ======================================================
   🔹 1. Get all tariffs (with search & pagination)
====================================================== */
export async function fetchTariffsApi({ search = "", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
  });
}

/* ======================================================
   🔹 2. Create new tariff
====================================================== */
export async function createTariffApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // { title, tuition }
  });
}

/* ======================================================
   🔹 3. Get one tariff by ID
====================================================== */
export async function fetchTariffByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "GET",
  });
}

/* ======================================================
   🔹 4. Update tariff by ID
====================================================== */
export async function updateTariffApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // { title, tuition }
  });
}

/* ======================================================
   🔹 5. Delete tariff by ID
====================================================== */
export async function deleteTariffApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
