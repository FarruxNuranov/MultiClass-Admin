import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = "/lessonplans";

/* ======================================================
   📘 Получить список Lesson Plans (по classId)
====================================================== */
export async function fetchLessonPlans(classId) {
  const query = classId ? `?class=${classId}` : "";
  const res = await authorizedFetch(`${BASE_URL}${query}`, {
    method: "GET",
  });
  return res?.data || [];
}

/* ======================================================
   🆕 Создать Lesson Plan
====================================================== */
export async function createLessonPlan(payload) {
  return authorizedFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* ======================================================
   ✏️ Обновить Lesson Plan
====================================================== */
export async function updateLessonPlan(id, payload) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* ======================================================
   ❌ Удалить Lesson Plan
====================================================== */
export async function deleteLessonPlan(id) {
  return authorizedFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}