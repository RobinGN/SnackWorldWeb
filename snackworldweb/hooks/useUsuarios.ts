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
            const usuarios = await apiFetch.getUsuarios();
            
            // La API podría devolver los usuarios directamente o en un objeto
            // Ajustar según la respuesta real de tu API
            const usuariosArray = Array.isArray(usuarios) ? usuarios : usuarios.usuarios || [];
            
            // Calcular estadísticas localmente ya que no hay endpoint específico para stats
            const totalUsers = usuariosArray.length;
            const totalSubscriptions = usuariosArray.filter((user: Usuario) => user.suscripcionActiva).length;
            const averageSubscriptionValue = 45; // Ajustar según tu lógica de negocio
            const totalValue = totalSubscriptions * averageSubscriptionValue;
            
            setData({
                totalUsers,
                totalSubscriptions,
                totalValue,
                usuarios: usuariosArray
            });
        } catch (err: any) {
            console.error('Error fetching usuarios:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchUsuarios
    };
};