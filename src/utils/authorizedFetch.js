import config from "../config/config";
import { jwtDecode } from "jwt-decode";


export async function authorizedFetch(endpoint, options = {}) {
  const noAuthEndpoints = ["/auth/login", "/auth/select-role", "/auth/register"];

  //  Agar endpoint istisnolar ro‘yxatida bo‘lsa → token tekshirilmaydi
  if (noAuthEndpoints.some((e) => endpoint.startsWith(e))) {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? response.json()
      : response.text();
  }

  // Token tekshiruvi
  const token = localStorage.getItem("token");
  if (!token) {
    redirectToLogin();
    throw new Error("Unauthorized: no token found");
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn("⏰ Token expired");
      redirectToLogin();
      throw new Error("Token expired");
    }
  } catch (err) {
    console.error("Invalid token:", err);
    redirectToLogin();
    throw new Error("Invalid token");
  }

  //  Token bilan so‘rov
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  //  Auth status tekshirish
  if (response.status === 401 || response.status === 403) {
    console.warn("🔒 Unauthorized or forbidden, redirecting to login...");
    redirectToLogin();
    throw new Error("Unauthorized or forbidden");
  }

  //  Response
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  return contentType && contentType.includes("application/json")
    ? response.json()
    : response.text();
}

/**  Login sahifasiga redirect + token tozalash */
function redirectToLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
}
