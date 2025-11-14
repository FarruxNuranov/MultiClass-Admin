import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/schedules";

export async function fetchMyStudentScheduleApi() {
  return authorizedFetch(`${BASE_URL}/my/student`, { method: "GET" });
}