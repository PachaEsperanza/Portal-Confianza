import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { suppliers, type Supplier } from "@/mocks/suppliers";

interface AuthUser {
  supplier_id: string;
  name: string;
  category: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (supplier_id: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerFirstAccess: (supplier_id: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  registerNewSupplier: (name: string, category: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string; supplier_id?: string }>;
  logout: () => void;
  isFirstAccess: (supplier_id: string) => boolean;
  supplierExists: (supplier_id: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "supplier_auth_users_v2";
const SESSION_KEY = "supplier_auth_session_v2";

function getStoredUsers(): Supplier[] {
  // Borrar datos viejos con la key anterior para evitar conflictos
  localStorage.removeItem("supplier_auth_users");

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  return suppliers;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  function supplierExists(supplier_id: string): boolean {
    const users = getStoredUsers();
    return users.some((u) => u.supplier_id === supplier_id && u.status === "active");
  }

  function isFirstAccess(supplier_id: string): boolean {
    const users = getStoredUsers();
    const found = users.find((u) => u.supplier_id === supplier_id);
    return found ? found.password === null : false;
  }

  async function registerFirstAccess(
    supplier_id: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!supplierExists(supplier_id)) {
      return { success: false, message: "Código de proveedor no encontrado o inactivo." };
    }

    if (!isFirstAccess(supplier_id)) {
      return { success: false, message: "Este proveedor ya tiene una contraseña configurada. Use el acceso normal." };
    }

    if (password.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden." };
    }

    const users = getStoredUsers();
    const updated = users.map((u) =>
      u.supplier_id === supplier_id ? { ...u, password } : u,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const found = updated.find((u) => u.supplier_id === supplier_id)!;
    const authUser: AuthUser = {
      supplier_id: found.supplier_id,
      name: found.name,
      category: found.category,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);

    return { success: true, message: "Contraseña creada exitosamente. Bienvenido al portal." };
  }

  async function registerNewSupplier(
    name: string,
    category: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string; supplier_id?: string }> {
    if (!name.trim()) {
      return { success: false, message: "Ingrese su nombre." };
    }
    if (password.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }
    if (password !== confirmPassword) {
      return { success: false, message: "Las contraseñas no coinciden." };
    }

    const users = getStoredUsers();

    const maxNum = users.reduce((max, u) => {
      const match = u.supplier_id.match(/SUP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return Math.max(max, num);
      }
      return max;
    }, 0);

    const newId = `SUP-${String(maxNum + 1).padStart(3, "0")}`;

    const newSupplier: Supplier = {
      supplier_id: newId,
      name: name.trim(),
      category: category.trim().toLowerCase(),
      password,
      status: "active",
    };

    users.push(newSupplier);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    const authUser: AuthUser = {
      supplier_id: newSupplier.supplier_id,
      name: newSupplier.name,
      category: newSupplier.category,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);

    return { success: true, message: "Registro exitoso. Bienvenido al portal.", supplier_id: newId };
  }

  async function login(supplier_id: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!supplierExists(supplier_id)) {
      return { success: false, message: "Código de proveedor no encontrado o inactivo." };
    }

    if (isFirstAccess(supplier_id)) {
      return { success: false, message: "Este es su primer acceso. Por favor, configure su contraseña primero." };
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.supplier_id === supplier_id);

    if (!found || found.password !== password) {
      return { success: false, message: "Código de proveedor o contraseña incorrectos." };
    }

    const authUser: AuthUser = {
      supplier_id: found.supplier_id,
      name: found.name,
      category: found.category,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setUser(authUser);

    return { success: true, message: "Inicio de sesión exitoso." };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, registerFirstAccess, registerNewSupplier, logout, isFirstAccess, supplierExists }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
}