"use client"

import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";

interface User {
    nombre?: string;
    correo: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (correo: string, contrasena: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check inicial de auth
        const checkAuth = async () => {
            try {
                const authenticated = authService.isAuthenticated();
                setIsAuthenticated(authenticated);
                
                if (authenticated) {
                    // Aquí podrías obtener los datos del usuario si es necesario
                    // const userData = await apiFetch.getPerfil();
                    // setUser(userData);
                }
            } catch (e) {
                console.error('Error de verificación de auth', e);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (correo: string, contrasena: string) => {
        setIsLoading(true);
        try {
            const response = await authService.login(correo, contrasena);
            setIsAuthenticated(true);
            setUser({ correo });
            router.push('/dashboard'); // Redirigir al dashboard después del login
        } catch (e) {
            console.error('Error en login ', e);
            throw e; // Re-throw para que el componente de login pueda manejarlo
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            router.push('/login'); // Redirigir al login después del logout
        } catch (e) {
            console.error('Error al salir de la sesión', e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);