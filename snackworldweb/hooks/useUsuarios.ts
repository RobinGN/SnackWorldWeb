"use client"

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
    fechaRegistro: string;
    suscripcionActiva: boolean;
}

interface UsuariosData {
    totalUsers: number;
    totalSubscriptions: number;
    totalValue: number;
    usuarios: Usuario[];
}

export const useUsuarios = () => {
    const [data, setData] = useState<UsuariosData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Usar el endpoint correcto de admin
            const response = await apiFetch.getUsuarios();
            // Si la respuesta ya trae stats, úsalos directamente
            if (response && typeof response === 'object' && 'usuarios' in response) {
                setData({
                    totalUsers: response.totalUsers ?? response.usuarios.length,
                    totalSubscriptions: response.totalSubscriptions ?? response.usuarios.filter((u: Usuario) => u.suscripcionActiva).length,
                    totalValue: response.totalValue ?? (response.usuarios.filter((u: Usuario) => u.suscripcionActiva).length * 50),
                    usuarios: response.usuarios
                });
            } else {
                // fallback: solo array de usuarios
                const usuariosArray = Array.isArray(response) ? response : response.usuarios || [];
                const totalUsers = usuariosArray.length;
                const totalSubscriptions = usuariosArray.filter((user: Usuario) => user.suscripcionActiva).length;
                const totalValue = totalSubscriptions * 50;
                setData({
                    totalUsers,
                    totalSubscriptions,
                    totalValue,
                    usuarios: usuariosArray
                });
            }
        } catch (err: any) {
            console.error('Error fetching usuarios:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const eliminarUsuario = async (id: string) => {
        try {
            await apiFetch.eliminarUsuario(id);
            setData(prev => prev ? {
                ...prev,
                usuarios: prev.usuarios.filter(u => u._id !== id),
                totalUsers: prev.totalUsers - 1,
                totalSubscriptions: prev.totalSubscriptions - (prev.usuarios.find(u => u._id === id)?.suscripcionActiva ? 1 : 0),
                totalValue: (prev.totalSubscriptions - (prev.usuarios.find(u => u._id === id)?.suscripcionActiva ? 1 : 0)) * 50
            } : prev);
        } catch (err: any) {
            console.error('Error eliminando usuario:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchUsuarios,
        eliminarUsuario
    };
};