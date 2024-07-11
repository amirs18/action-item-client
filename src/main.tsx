import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./HomePage.tsx";
import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/fetch",
    element: <App />,
  },
  {
    path: "/history",
    element: <App history={true} />,
  },
  { path: "/", element: <HomePage /> },
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
