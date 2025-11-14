import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/topics";

export async function fetchTopicsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  return authorizedFetch(`${BASE_URL}?${query}`, { method: "GET" });
}

export async function fetchTopicByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, { method: "GET" });
}

export async function fetchTopicByIdStudentApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}/student`, { method: "GET" });
}

export async function createTopicApi(data) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTopicApi(id, data) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTopicApi(id) {
  const res = await authorizedFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return res || id;
}