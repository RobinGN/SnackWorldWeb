"use client"

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface Caja {
    _id: string;
    nombre: string;
    pais: string;
    descripcion: string;
    imagen: string;
    precio: number;
    productos: string[];
}

export const useCajas = () => {
    const [cajas, setCajas] = useState<Caja[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCajas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFetch.getCajas();
            setCajas(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error fetching cajas:', err);
            setError(err.response?.data?.message || err.message || 'Error al cargar cajas');
        } finally {
            setLoading(false);
        }
    };

    const crearCaja = async (cajaData: Omit<Caja, '_id'>) => {
        try {
            const nuevaCaja = await apiFetch.crearCaja(cajaData);
            setCajas(prev => [...prev, nuevaCaja]);
            return nuevaCaja;
        } catch (err: any) {
            console.error('Error creando caja:', err);
            throw err;
        }
    };

    const actualizarCaja = async (id: string, cajaData: Partial<Caja>) => {
        try {
            const cajaActualizada = await apiFetch.actualizarCaja(id, cajaData);
            setCajas(prev => prev.map(caja => 
                caja._id === id ? { ...caja, ...cajaActualizada } : caja
            ));
            return cajaActualizada;
        } catch (err: any) {
            console.error('Error actualizando caja:', err);
            throw err;
        }
    };

    const eliminarCaja = async (id: string) => {
        try {
            await apiFetch.eliminarCaja(id);
            setCajas(prev => prev.filter(caja => caja._id !== id));
        } catch (err: any) {
            console.error('Error eliminando caja:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchCajas();
    }, []);

    return {
        cajas,
        loading,
        error,
        refetch: fetchCajas,
        crearCaja,
        actualizarCaja,
        eliminarCaja
    };
};