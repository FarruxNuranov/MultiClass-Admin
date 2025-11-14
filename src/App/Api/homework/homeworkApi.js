import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/homework";

/* ======================================================
   🧩 1. Получить список домашних заданий по topicId
====================================================== */
export async function fetchHomeworkByTopicApi(topicId, page = 1, limit = 10) {
  const params = new URLSearchParams();
  if (topicId) params.append("topic", topicId);
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}?${params.toString()}`, {
    method: "GET",
  });
}

/* ======================================================
   🎓 2. Получить список домашних заданий текущего студента
====================================================== */
export async function fetchMyHomeworkApi(page = 1, limit = 10) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  return authorizedFetch(`${BASE_URL}/my?${params.toString()}`, {
    method: "GET",
  });
}

/* ======================================================
   🧾 3. Получить одно домашнее задание по ID
====================================================== */
export async function fetchHomeworkByIdApi(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "GET",
  });
}

/* ======================================================
   🧮 4. Обновить оценку (для учителя/админа)
====================================================== */
export async function updateHomeworkGradeApi(id, mark) {
  return authorizedFetch(`${BASE_URL}/grade/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mark }),
  });
}