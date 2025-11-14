import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/news";

export async function fetchNewsApi() {
  return authorizedFetch(BASE_URL, { method: "GET" });
}

export async function fetchNewsByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

export async function createNewsApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateNewsApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteNewsApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}