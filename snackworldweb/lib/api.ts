import axios from 'axios';

const API_URL = 'https://snackworld-api.vercel.app';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de auth automáticamente
api.interceptors.request.use(
    async (config) => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth-token='))
            ?.split('=')[1];
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const apiFetch = {
    getCajas: async () => {
        try {
            console.log('Iniciando fetching de cajas');
            const response = await api.get('/api/cajas');
            console.log('Datos de cajas', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error en fetching de cajas', e);
            throw e;
        }
    },

    getCajaById: async (id: string) => {
        try {
            console.log('Iniciando fetching de caja');
            const response = await api.get(`/api/cajas/${id}`);
            console.log('Datos de la caja', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error en fetching de la caja', e);
            throw e;
        }
    },

    // Para el dashboard admin - obtener todos los usuarios (requiere rol admin)
    getUsuarios: async () => {
        try {
            console.log('Iniciando fetching de usuarios admin');
            const response = await api.get('/api/admin/usuarios');
            console.log('Datos de usuarios admin', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error en fetching de usuarios admin', e);
            throw e;
        }
    },

    

    // Eliminar usuario (solo admin)
    eliminarUsuario: async (id: string) => {
        try {
            console.log('Eliminando usuario:', id);
            const response = await api.delete(`/api/admin/usuarios/${id}`);
            console.log('Usuario eliminado', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error eliminando usuario', e);
            throw e;
        }
    },

    getPerfil: async () => {
        try {
            console.log('Iniciando fetching de usuario de perfil');
            const response = await api.get('/api/usuario/perfil');
            console.log('Datos de usuario de perfil', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error al momento de obtener el perfil', e);
            throw e;
        }
    },

    getSuscripciones: async () => {
        try {
            const response = await api.get('/api/subscription/activas'); 
            console.log('Suscripciones activas', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error ', e);
            throw e;
        }
    },

    getRevenue: async () => {
        try{
            const response = await api.get('/api/subscription/ingresos');
            console.log('Total de ingresos', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error al momento de obtener los ingresos', e);
            throw e;
        }
    },
    


    
    crearCaja: async (cajaData: any) => {
        try {
            const payload = {
                nombre: cajaData.nombre?.trim(),
                pais: cajaData.pais?.trim(),
                descripcion: cajaData.descripcion?.trim(),
                imagen: cajaData.imagen?.trim(),
                precio: Number(cajaData.precio),
                productos: Array.isArray(cajaData.productos) ? (cajaData.productos as string[]).filter((p) => !!p && p.trim() !== "") : [],
            };
            if (!payload.nombre || !payload.pais || !payload.descripcion || !payload.imagen || !payload.precio || payload.productos.length === 0) {
                throw new Error("Todos los campos son obligatorios y debe haber al menos un producto.");
            }
            console.log('Payload enviado a /api/cajas:', payload);
            const response = await api.post('/api/cajas', payload);
            console.log('Caja creada', response.data);
            return response.data;
        } catch (e: any) {
            const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
            console.error('Error creando caja', backendMsg || e);
            throw new Error(backendMsg || 'Error creando caja');
        }
    },

    actualizarCaja: async (id: string, cajaData: any) => {
        try {
            console.log('Actualizando caja:', id);
            const response = await api.put(`/api/cajas/${id}`, cajaData);
            console.log('Caja actualizada', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error actualizando caja', e);
            throw e;
        }
    },

    eliminarCaja: async (id: string) => {
        try {
            console.log('Eliminando caja:', id);
            const response = await api.delete(`/api/cajas/${id}`);
            console.log('Caja eliminada', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error eliminando caja', e);
            throw e;
        }
    },

    getOpiniones: async (cajaId: string) => {
        try {
            console.log('Obteniendo opiniones de caja:', cajaId);
            const response = await api.get(`/api/opiniones/${cajaId}`);
            console.log('Opiniones obtenidas', response.data);
            return response.data;
        } catch (e: any) {
            console.error('Error obteniendo opiniones', e);
            throw e;
        }
    }
};

export const authService = {
    login: async (correo: string, contrasena: string) => {
        try {
            console.log('Iniciando login');
            const response = await api.post('/api/auth/login', {
                correo,
                contrasena
            });

            if (response.data.token) {
                document.cookie = `auth-token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; 
                console.log('Token guardado en cookie');
            } else {
                throw new Error('No se recibió token en la respuesta');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error en login:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    logout: async () => {
        try {
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            return { success: true };
        } catch (error) {
            console.error('No se ha podido salir de la sesión', error);
            throw error;
        }
    },

    isAuthenticated: () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('auth-token='))
                ?.split('=')[1];
            return !!token;
        } catch (e) {
            return false;
        }
    }
};

export default api;