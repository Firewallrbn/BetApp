// app/contexts/AuthContext.tsx
import { supabase } from "@/utils/supabase";
import React, { createContext, useState } from "react";



interface AuthContextProps {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
}

const fakeDataSource = [
    {
        email: "test@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test1@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test2@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "a",
        password: "a",
        name: "a"
    }

]

export const AuthContext = createContext({} as AuthContextProps);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState(false);

       /* const login =async (email:string, password:string)=>{
        for (let index = 0; index < fakeDataSource.length; index++) {
            if (fakeDataSource[index].email===email && fakeDataSource[index].password===password) {
               
                return true;
            }
        }
        return false
    }
    */

    const login = async (email:string, password:string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.user) {
          return false;
        }
        if (data.user) {
            setUser(data.user);
        }
        return true;
      };

 const register = async (email: string, password: string, fullName?: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: fullName
                    ? {
                          data: {
                              full_name: fullName,
                          },
                      }
                    : undefined,
            });
            if (error || !data.user) {
                return false;
            }
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
    }

    return <AuthContext.Provider
        value={{
            user,
            isLoading,
            login,
            register,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
};
