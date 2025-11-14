const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL,
};

export default config;

// src/pages/DashboardPages/FinancePage/financeConfig.js
import dayjs from "dayjs";

/**
 * Period nomiga qarab API parametrlarga aylantiruvchi funksiya
 * @param {string} period - tanlangan period nomi (t("finance.period.*"))
 * @param {function} t - i18n translation function
 * @returns {string|null}
 */
export const getPeriodParam = (period, t) => {
  switch (period) {
    case t("finance.period.24h"):
      return "24h";
    case t("finance.period.7days"):
      return "7d";
    case t("finance.period.30days"):
      return "30d";
    case t("finance.period.12months"):
      return "12m";
    default:
      return null;
  }
};
export const teacherId = "690828a42a343d3a1d8879e3"
/**
 * Period o‘zgarishida sanalarni avtomatik hisoblab beradi
 * @param {string} val - tanlangan period nomi (t("finance.period.*"))
 * @param {function} t - i18n translation function
 * @param {function} setPeriod - React setState (period)
 * @param {function} setSelectedRange - React setState ([from, to])
 */
export const handlePeriodChange = (val, t, setPeriod, setSelectedRange) => {
  setPeriod(val);

  const now = dayjs();
  if (val === t("finance.period.custom")) return;

  switch (val) {
    case t("finance.period.24h"):
      setSelectedRange([now.subtract(1, "day"), now]);
      break;
    case t("finance.period.7days"):
      setSelectedRange([now.subtract(7, "day"), now]);
      break;
    case t("finance.period.30days"):
      setSelectedRange([now.subtract(30, "day"), now]);
      break;
    case t("finance.period.12months"):
      setSelectedRange([now.subtract(12, "month"), now]);
      break;
    default:
      setSelectedRange([null, null]);
  }
};
