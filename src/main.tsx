import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { preload } from "swr";

import { getTodos, todosUrlEndpoint as cacheKey } from "./api/todosApi";
const url = `${cacheKey}?_page=1&_limit=10`;

preload(cacheKey, () => getTodos(url));

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
