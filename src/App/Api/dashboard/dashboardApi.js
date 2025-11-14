// src/App/Api/dashboardApi.js

import { authorizedFetch } from "../../../utils/authorizedFetch";


const DASHBOARD_BASE_URL = "/dashboard";

/**
 * 🔹 Dashboard statistikasi (GET, parametr yo‘q)
 */
export async function fetchDashboardStatistics() {
  return authorizedFetch(`${DASHBOARD_BASE_URL}/statistics`, {
    method: "GET",
  });
}
