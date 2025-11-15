import { authorizedFetch } from "../../../utils/authorizedFetch";

export async function getMeApi() {
  try {
    // `authorizedFetch` сам добавит токен и проверит его срок действия
    const res = await authorizedFetch("/profile/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res?.data?.user;
  } catch (error) {
    console.error("❌ getMeApi error:", error);
    throw error;
  }
}