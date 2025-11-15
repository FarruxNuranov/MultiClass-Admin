// src/features/tenantAdmins/tenantAdminsApi.js

import { authorizedFetch } from "../../../utils/authorizedFetch";


const BASE_URL = "https://api.multi-class.uz/api/v1/platform/tenant-admins";

// GET ALL TENANT ADMINS
export async function getTenantAdminsApi({ tenantId, search = "" }) {
  try {
    const params = new URLSearchParams();
    if (tenantId) params.append("tenantId", tenantId);
    if (search) params.append("search", search);

    const data = await authorizedFetch(`${BASE_URL}?${params.toString()}`);
    return data?.data || [];
  } catch (err) {
    throw new Error(err.message || "Failed to load tenant admins");
  }
}

// CREATE TENANT ADMIN
export async function createTenantAdminApi(payload) {
  try {
    const data = await authorizedFetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to create tenant admin");
  }
}
