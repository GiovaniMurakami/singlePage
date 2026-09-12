import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    addToast(mensagem, tipo = "info") {
      const id = crypto.randomUUID();
      setToasts((atuais) => [...atuais, { id, mensagem, tipo }]);
      window.setTimeout(() => {
        setToasts((atuais) => atuais.filter((item) => item.id !== id));
      }, 3200);
    },
  }), []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-4 py-3 text-sm shadow-lg ${
              toast.tipo === "erro" ? "bg-red-700 text-white" : "bg-ink text-paper"
            }`}
          >
            {toast.mensagem}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
