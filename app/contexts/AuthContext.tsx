// app/contexts/AuthContext.tsx
import React, { createContext, useState } from "react";


interface AuthContextProps {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<void>;
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
  const [user, setUser] = useState (null);
  const [isLoading, setIsLoading] = useState(false);

        const login =async (email:string, password:string)=>{
        for (let index = 0; index < fakeDataSource.length; index++) {
            if (fakeDataSource[index].email===email && fakeDataSource[index].password===password) {
               
                return true;
            }
        }
        return false
    }


 const register = async () => {

    }

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
}