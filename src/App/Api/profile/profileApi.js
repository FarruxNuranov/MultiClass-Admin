// src/features/profile/profileApi.js

import { authorizedFetch } from "../../../utils/authorizedFetch";


const BASE_URL = "https://api.multi-class.uz/api/v1/platform/profile";

/* -------------------------------------------------------
   1) GET PROFILE (me)
------------------------------------------------------- */
export async function getMyProfileApi() {
  try {
    const res = await authorizedFetch(`${BASE_URL}/me`, {
      method: "GET",
    });
    return res?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to load profile");
  }
}

/* -------------------------------------------------------
   2) UPDATE PASSWORD
------------------------------------------------------- */
export async function updatePasswordApi(payload) {
  // { current_password, new_password }
  try {
    const res = await authorizedFetch(`${BASE_URL}/update-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to update password");
  }
}

/* -------------------------------------------------------
   3) UPDATE PROFILE INFO
------------------------------------------------------- */
export async function updateProfileApi(payload) {
  // { firstName, lastName }
  try {
    const res = await authorizedFetch(`${BASE_URL}/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res?.data;
  } catch (err) {
    throw new Error(err.message || "Failed to update profile");
  }
}
