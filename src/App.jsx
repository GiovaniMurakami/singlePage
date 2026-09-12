import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AppRoutes } from "./routes/AppRoutes";
import { HelpButton } from "./components/ui/HelpButton";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
        <HelpButton />
      </ToastProvider>
    </AuthProvider>
  );
}
