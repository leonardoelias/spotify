import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import "./style.css";

import "./shared/i18n/config";

async function enableMocking() {
  if (import.meta.env.VITE_MSW !== "true") {
    return;
  }

  const { worker } = await import("./test/mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
