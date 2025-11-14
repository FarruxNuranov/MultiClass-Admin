import { authorizedFetch } from "../../../utils/authorizedFetch";

// ✅ Создать задание (домашку)
export async function createAssignmentApi({ homeworkId, files }) {
  return authorizedFetch("/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      homework: homeworkId,
      files,
    }),
  });
}