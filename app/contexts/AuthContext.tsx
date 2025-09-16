// app/contexts/AuthContext.tsx
import { supabase } from "@/utils/supabase";
import type { User } from "@supabase/supabase-js";
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error al obtener la sesión", error.message);
          return;
        }

        if (isMounted) {
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error("Error inesperado al obtener la sesión", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      },
    );

    return () => {
      isMounted = false;
      authSubscription?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Error al iniciar sesión", error.message);
        return false;
      }

      if (data.user) {
        setUser(data.user);
      }

      return true;
    } catch (error) {
      console.error("Error inesperado al iniciar sesión", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Error al registrar usuario", error.message);
        return false;
      }

      if (data.user) {
        setUser(data.user);
      }

      return true;
    } catch (error) {
      console.error("Error inesperado al registrar usuario", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error al cerrar sesión", error.message);
      }
    } catch (error) {
      console.error("Error inesperado al cerrar sesión", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
