import React, { createContext, useCallback, useState } from "react";
import { supabase } from "@/utils/supabase";

interface Profile {
  id: string;
  full_name?: string | null;
  balance?: number | null;
  bets_open?: number | null;
  win_rate?: number | null;
  avatar_url?: string | null;
}

interface AuthContextProps {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  updateProfile: (values: {
    full_name?: string;
    balance?: number;
    bets_open?: number;
    win_rate?: number;
  }) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async (authUser: any) => {
    if (!authUser?.id) {
      setProfile(null);
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileError) {
      if ((profileError as any)?.code === "PGRST116") {
        const defaultProfile: Profile = {
          id: authUser.id,
          full_name:
            authUser?.user_metadata?.display_name ||
            authUser?.user_metadata?.full_name ||
            authUser?.email ||
            "",
          balance: 0,
          bets_open: 0,
          win_rate: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .upsert(defaultProfile)
          .select("*")
          .single();

        if (!createError && createdProfile) {
          setProfile(createdProfile);
          return createdProfile;
        }

        console.error("Error creando perfil por defecto", createError);
        return null;
      }

      console.error("Error obteniendo perfil", profileError);
      return null;
    }

    setProfile(profileData);
    return profileData;
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error("Error al iniciar sesión", error);
        return false;
      }

      setUser(data.user);
      await fetchProfile(data.user);
      return true;
    } catch (err) {
      console.error("Error inesperado al iniciar sesión", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: fullName
          ? {
              data: { full_name: fullName, display_name: fullName },
            }
          : undefined,
      });

      if (error || !data.user) {
        console.error("Error al registrar usuario", error);
        return false;
      }

      const baseProfile: Profile = {
        id: data.user.id,
        full_name: fullName || data.user.email,
        balance: 0,
        bets_open: 0,
        win_rate: 0,
      };

      const { error: profileError } = await supabase.from("profiles").upsert(baseProfile);
      if (profileError) {
        console.error("No se pudo crear el perfil", profileError);
      }

      if (fullName) {
        const display = fullName.trim();
        if (display) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { display_name: display, full_name: display },
          });
          if (updateError) {
            console.error("No se pudo actualizar el nombre visible", updateError);
          }
        }
      }

      return true;
    } catch (err) {
      console.error("Error inesperado al registrar", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (values: {
    full_name?: string;
    balance?: number;
    bets_open?: number;
    win_rate?: number;
  }) => {
    if (!user?.id) {
      return false;
    }

    const payload = {
      id: user.id,
      ...values,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .upsert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("No se pudo actualizar el perfil", error);
      return false;
    }

    if (values.full_name) {
      const display = values.full_name.trim();
      if (display) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { display_name: display, full_name: display },
        });
        if (updateError) {
          console.error("No se pudo actualizar el nombre visible", updateError);
        } else {
          setUser((prev: any) =>
            prev
              ? {
                  ...prev,
                  user_metadata: {
                    ...prev.user_metadata,
                    display_name: display,
                    full_name: display,
                  },
                }
              : prev,
          );
        }
      }
    }

    setProfile(updatedProfile);
    return true;
  };

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        updateProfile,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
