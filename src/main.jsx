// src/main.jsx
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "antd/dist/reset.css";
import "./styles/main.scss"; 
import { store } from "./App/store";
import AppTheme from "./AppTheme";

// 🈯️ Подключаем i18n
import "./config/i18n";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppTheme />
  </Provider>
);
