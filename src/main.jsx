// src/main.jsx
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "antd/dist/reset.css";
import "./styles/main.scss";
import { store } from "./App/store";
import { router } from "./routes/Routes";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
