import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/schedules/my/teacher";

export async function fetchTeacherScheduleApi() {
  return authorizedFetch(BASE_URL, { method: "GET" });
}