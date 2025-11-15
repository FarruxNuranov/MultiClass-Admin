import { authorizedFetch } from "../../../utils/authorizedFetch";

const BASE_URL = `/auth`;

export async function loginUserApi({ phone, password }) {
  try {
    const response = await authorizedFetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    // Tokenni data.data.token ichidan olish kerak
    if (response?.data?.token) {
      return {
        type: "singleAccount",
        token: response.data.token,
      };
    }

    // Agar kelajakda role selection qo‘shilsa
    if (response?.data?.requiresRoleSelection) {
      return {
        type: "roleSelection",
      };
    }

    throw new Error("Noto‘g‘ri javob formati qaytdi");
  } catch (err) {
    console.error("❌ loginUserApi error:", err);
    throw new Error(err.message || "Server javob bermadi.");
  }
}
