"use client"

import { useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService, apiFetch } from "@/lib/api";

interface User {
    nombre?: string;
    correo: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (correo: string, contrasena: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check inicial de auth
        const checkAuth = async () => {
            try {
                const authenticated = authService.isAuthenticated();
                setIsAuthenticated(authenticated);
                
                if (authenticated) {
                    try {
                        const userData = await apiFetch.getPerfil();
                        setUser(userData);
                        setIsAdmin(userData.correo === 'admin@demo.com');
                    } catch (e) {
                        console.error('Error obteniendo perfil', e);
                        setIsAuthenticated(false);
                        setUser(null);
                        setIsAdmin(false);
                    }
                }
            } catch (e) {
                console.error('Error de verificación de auth', e);
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
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
            const userData = await apiFetch.getPerfil();
            const isUserAdmin = userData.correo === 'admin@demo.com';
            
            if (!isUserAdmin) {
                await authService.logout();
                throw new Error('No tienes permisos de administrador para acceder a esta página.');
            }

            setIsAuthenticated(true);
            setIsAdmin(true);
            setUser(userData);
            router.push('/dashboard');
        } catch (e: any) {
            console.error('Error en login ', e);
            throw new Error(e.message || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUser(null);
            router.push('/login');
        } catch (e) {
            console.error('Error al salir de la sesión', e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};