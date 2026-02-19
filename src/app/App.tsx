import { useQueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { QueryProvider } from "./providers/QueryProvider";
import { router } from "./router";

import { AuthProvider, useAuth } from "@/features/auth";
import { LibraryProvider } from "@/features/library";
import { ToastProvider } from "@/shared/components";

function InnerApp() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

export function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <LibraryProvider>
          <ToastProvider>
            <InnerApp />
          </ToastProvider>
        </LibraryProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
