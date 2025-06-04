"use client"

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
    fechaRegistro: string;
    suscripcionActiva: boolean;
    suscripcion?: any;
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
            console.log('RESPUESTA USUARIOS BACKEND', response);
            // Si la respuesta ya trae stats, úsarlos directamente
            if (response && typeof response === 'object' && 'usuarios' in response) {
                setData({
                    totalUsers: response.totalUsers ?? response.usuarios.length,
                    totalSubscriptions: response.totalSubscriptions ?? response.usuarios.filter((u: any) => u.suscripcionActiva).length,
                    totalValue: response.totalValue ?? (response.usuarios.filter((u: any) => u.suscripcionActiva).length * 50),
                    usuarios: response.usuarios.map((u: any) => ({
                        ...u,
                        fechaRegistro: u.fechaRegistro || u.createdAt || '',
                        suscripcion: u.suscripcion ?? null
                    }))
                });
            } else {
                // Solo array de usuarios
                const usuariosArray = Array.isArray(response) ? response : response.usuarios || [];
                const totalUsers = usuariosArray.length;
                const totalSubscriptions = usuariosArray.filter((user: any) => user.suscripcionActiva).length;
                const totalValue = totalSubscriptions * 50;
                setData({
                    totalUsers,
                    totalSubscriptions,
                    totalValue,
                    usuarios: usuariosArray.map((u: any) => ({
                        ...u,
                        fechaRegistro: u.fechaRegistro || u.createdAt || '',
                        suscripcion: u.suscripcion ?? null
                    }))
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