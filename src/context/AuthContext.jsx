import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY } from "../constants/auth";
import { buscarPerfil, cadastrarUsuario, loginUsuario, logoutUsuario } from "../services/backendApi";

const AuthContext = createContext(null);

function readAuth() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const saved = readAuth();
  const [token, setToken] = useState(saved?.token || "");
  const [usuario, setUsuario] = useState(saved?.usuario || null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onLogout = () => {
      setToken("");
      setUsuario(null);
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const perfil = await buscarPerfil();
        if (!cancelled) setUsuario(perfil);
      } catch {
        if (!cancelled) {
          window.localStorage.removeItem(AUTH_STORAGE_KEY);
          setToken("");
          setUsuario(null);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    };
    boot();
    return () => { cancelled = true; };
  }, [token]);

  const persist = (sessao) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessao));
    setToken(sessao.token);
    setUsuario(sessao.usuario);
  };

  const api = useMemo(() => ({
    token,
    usuario,
    ready,
    autenticado: Boolean(token && usuario),
    async login(dados) {
      persist(await loginUsuario(dados));
    },
    async cadastrar(dados) {
      persist(await cadastrarUsuario(dados));
    },
    async logout() {
      const auth = readAuth();
      try {
        await logoutUsuario(auth?.refreshToken);
      } catch {
        /* sessao local ainda precisa sair */
      }
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setToken("");
      setUsuario(null);
    },
    atualizarUsuario(proximo) {
      setUsuario(proximo);
      const auth = readAuth();
      if (auth) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...auth, usuario: proximo }));
      }
    },
  }), [token, usuario, ready]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
