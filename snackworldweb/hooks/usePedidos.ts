//no fue utilizado al final de todo el proyecto, se dejo aqui por si acaso
"use client"

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Pedido {
    _id: string;
    usuario: {
        _id: string;
        nombre: string;
        correo: string;
    };
    items: Array<{
        caja: {
            _id: string;
            nombre: string;
            precio: number;
        };
        cantidad: number;
    }>;
    estado: string;
    fechaPedido: string;
    total: number;
}

export const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFetch.getPedidos();
            setPedidos(Array.isArray(data) ? data : data.pedidos || []);
        } catch (err: any) {
            console.error('Error fetching pedidos:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return {
        pedidos,
        loading,
        error,
        refetch: fetchPedidos
    };
};