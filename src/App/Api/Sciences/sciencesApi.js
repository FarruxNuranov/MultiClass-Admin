import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/sciences";

export async function createScienceApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchSciencesApi() {
  return authorizedFetch(BASE_URL, { method: "GET" });
}

export async function updateScienceApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteScienceApi(id) {
  const res = await authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res || { success: true, id };
}