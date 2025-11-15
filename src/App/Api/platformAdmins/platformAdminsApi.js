// src/features/platformAdmins/platformAdminsApi.js

import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "https://api.multi-class.uz/api/v1/platform/platform-admins";

/* -------------------------------------------------------
   1) GET ALL (search)
------------------------------------------------------- */
export async function getPlatformAdminsApi(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";

  try {
    const data = await authorizedFetch(`${BASE_URL}${query}`, {
      method: "GET",
    });
    return data?.data || [];
  } catch (err) {
    throw new Error(err.message || "Failed to fetch platform admins");
  }
}

/* -------------------------------------------------------
   2) CREATE ADMIN (POST)
------------------------------------------------------- */
export async function createPlatformAdminApi(payload) {
  try {
    const data = await authorizedFetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to create platform admin");
  }
}

/* -------------------------------------------------------
   3) GET BY ID
------------------------------------------------------- */
export async function getPlatformAdminByIdApi(id) {
  try {
    const data = await authorizedFetch(`${BASE_URL}/${id}`, {
      method: "GET",
    });
    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to load admin");
  }
}

/* -------------------------------------------------------
   4) UPDATE ADMIN (PUT)
------------------------------------------------------- */
export async function updatePlatformAdminApi(id, payload) {
  try {
    const data = await authorizedFetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to update admin");
  }
}

/* -------------------------------------------------------
   5) DELETE ADMIN
------------------------------------------------------- */
export async function deletePlatformAdminApi(id) {
  try {
    const data = await authorizedFetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to delete admin");
  }
}

/* -------------------------------------------------------
   6) CHANGE PASSWORD (POST)
------------------------------------------------------- */
export async function changePlatformAdminPasswordApi(payload) {
  try {
    const data = await authorizedFetch(`${BASE_URL}/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // { new_password }
    });
    return data?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to change password");
  }
}
