// app/contexts/AuthContext.tsx
import { supabase } from "@/utils/supabase";
import React, { createContext, useState } from "react";

export type Profile = {
  id?: string;
  email?: string | null;
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  birth_date?: string | null; // ISO YYYY-MM-DD
  phone?: string | null;
  gender?: string | null;
  points?: number | null;
  is_verified?: boolean | null;
  last_active?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  balance?: number | null;
  bets_count?: number | null;
  win_rate?: number | null;
  bets_open?: number | null;
};

interface AuthContextProps {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  setUser: (u: Profile | null) => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login: autentica y luego intenta cargar el registro de profiles
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data?.user) {
        console.error("Auth login error:", error);
        return false;
      }

      // Buscar perfil en tabla profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!profileError && profile) {
        setUser(profile);
      } else {
        // Fallback a datos básicos si no hay registro en profiles
        setUser({
          id: data.user.id,
          email: data.user.email ?? undefined,
          name: (data.user.user_metadata as any)?.full_name ?? data.user.email?.split("@")[0],
        });
      }

      return true;
    } catch (err) {
      console.error("Login exception:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register: crea usuario en auth y crea profile en la tabla profiles
  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: fullName
          ? {
              data: { full_name: fullName },
            }
          : undefined,
      });

      if (error) {
        console.error("SignUp error:", error);
        return false;
      }

      if (data?.user) {
        // Insertar registro en profiles
        const profileInsert = {
          id: data.user.id,
          email,
          name: fullName ?? (data.user.user_metadata as any)?.full_name ?? email.split("@")[0],
          username: email.split("@")[0],
        };

        const { error: insertError } = await supabase.from("profiles").insert(profileInsert);
        if (insertError) {
          console.error("profiles insert error:", insertError);
          // aún así actualizamos user con datos básicos
          setUser({
            id: data.user.id,
            email,
            name: profileInsert.name,
          });
          return false;
        }

        // setUser con el nuevo profile (optimista)
        setUser(profileInsert as Profile);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Register exception:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout: limpia user y hace signOut en supabase
  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out warning:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Update profile: actualiza tabla profiles y hace merge en estado local
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user?.id) {
      console.error("No user id to update profile");
      return false;
    }

    setIsLoading(true);
    try {
      const updatePayload = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").update(updatePayload).eq("id", user.id);

      if (error) {
        console.error("Update profile error:", error);
        return false;
      }

      // Optimistic / merge update locally
      setUser((prev) => ({ ...(prev ?? {}), ...profileData }));

      return true;
    } catch (err) {
      console.error("Update profile exception:", err);
      return false;
    } finally {
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
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
