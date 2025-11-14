import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = `/auth`;

export async function loginUserApi({ phone, password, role }) {
  try {
    // authorizedFetch avtomatik ravishda tokenni tekshiradi va JSON qaytaradi
    const data = await authorizedFetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password, role }),
    });


    if (data?.data?.requiresRoleSelection) {
      return {
        type: "roleSelection",
        accounts: data?.data?.accounts || [],
      };
    }

    if (data?.data?.user && data?.data?.token) {
      return {
        type: "singleAccount",
        user: data.data.user,
        token: data.data.token,
      };
    }

    throw new Error("Noto‘g‘ri javob formati qaytdi");
  } catch (err) {
    console.error("❌ loginUserApi error:", err);
    throw new Error(err.message || "No response from server.");
  }
}
