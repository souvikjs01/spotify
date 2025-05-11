import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../lib/types";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const server = "http://localhost:3000";

interface UserContextType {
    user: User | null;
    isAuth: boolean;
    loading: boolean;
    btnLoading: boolean;
    loginUser: (
        email: string,
        password: string,
        navigate: (path: string) => void
    ) => Promise<void>;
    registerUser: (
        name: string,
        email: string,
        password: string,
        navigate: (path: string) => void
    ) => Promise<void>;
    logout: () => Promise<void>,
}
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}


export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [ user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    async function registerUser(name: string, email: string, password: string, navigate: (path: string) => void) {
        try {
            const { data } = await axios.post(`${server}/api/v1/user/register`, {
                name,
                email,
                password,
            })

            toast.success(data.message)
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate("/")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

    async function loginUser(email: string, password: string, navigate: (path: string) => void) {
        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, {
                email,
                password,
            })

            toast.success(data.message)
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate("/")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

    async function logout() {
        localStorage.clear();
        setUser(null);
        setIsAuth(false);

        toast.success("User logged out");
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${server}/api/v1/user/me`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })

            setUser(data)
            setIsAuth(true)
        } catch (error) {
            console.log(error);            
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <UserContext.Provider
            value={{ 
                user,
                isAuth,
                loading,
                btnLoading,
                loginUser,
                registerUser,
                logout,
            }}
        >
            {children}
            <Toaster />
        </UserContext.Provider>
    )
}

export const useUserData = (): UserContextType => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("useUserData must be used within a userprovider")
    }
    return context;
}