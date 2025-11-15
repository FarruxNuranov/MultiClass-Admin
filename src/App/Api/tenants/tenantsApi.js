import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "tenants";

/* ---------------------------------------------------------
   1) GET ALL — barcha tenants (search bilan)
   GET /tenants?search=value
--------------------------------------------------------- */
export async function fetchTenantsApi(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return authorizedFetch(`${BASE_URL}${query}`, {
    method: "GET",
  });
}

/* ---------------------------------------------------------
   2) CREATE — tenant qo‘shish
   POST /tenants
--------------------------------------------------------- */
export async function createTenantApi({ title, note }) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, note }),
  });
}

/* ---------------------------------------------------------
   3) GET BY ID — bitta tenant
   GET /tenants/:id
--------------------------------------------------------- */
export async function fetchTenantByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "GET",
  });
}

/* ---------------------------------------------------------
   4) UPDATE — tenantni yangilash
   PUT /tenants/:id
--------------------------------------------------------- */
export async function updateTenantApi(id, { title, note }) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, note }),
  });
}

/* ---------------------------------------------------------
   5) DELETE — tenantni o‘chirish
   DELETE /tenants/:id
--------------------------------------------------------- */
export async function deleteTenantApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

/* ---------------------------------------------------------
   6) SEED ADMIN — tenantga admin yaratish
   POST /tenants/:id/seed-admin
--------------------------------------------------------- */
export async function seedAdminApi(id, adminData) {
  return authorizedFetch(`${BASE_URL}/${id}/seed-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adminData), // { phone, password, firstName, lastName, role }
  });
}
