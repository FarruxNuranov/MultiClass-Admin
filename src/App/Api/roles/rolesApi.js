// src/features/roles/rolesApi.js

import { authorizedFetch } from "../../../utils/authorizedFetch";


const BASE_URL = `roles`;

export async function getRolesByTenantApi({ tenantId, search = "" }) {
  try {
    const params = new URLSearchParams();
    if (tenantId) params.append("tenantId", tenantId);
    if (search) params.append("search", search);

    const data = await authorizedFetch(`${BASE_URL}/by-tenant?${params.toString()}`);
    return data?.data || [];
  } catch (err) {
    throw new Error(err.message || "Failed to fetch roles");
  }
}

export async function createRoleApi({ title, tenantId }) {
  try {
    const data = await authorizedFetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, tenantId }),
    });

    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to create role");
  }
}
