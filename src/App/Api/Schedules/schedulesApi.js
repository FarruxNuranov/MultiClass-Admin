import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/schedules";

export async function fetchSchedulesApi(classId) {
  return authorizedFetch(`${BASE_URL}?class=${classId}`, { method: "GET" });
}

export async function updateScheduleApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}