"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, DollarSign, Globe, User, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCajas } from "@/hooks/useCajas"
import { useUsuarios } from "@/hooks/useUsuarios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiFetch } from "@/lib/api"

interface SnackBox {
  _id: string
  nombre: string
  pais: string
  descripcion: string
  imagen: string
  precio: number
  productos: string[]
}

interface Usuario {
  _id: string
  nombre: string
  correo: string
  fechaRegistro: string
  suscripcionActiva?: boolean
}

export default function DashboardPage() {
  const { cajas, loading: loadingCajas, error: errorCajas, refetch: refetchCajas, eliminarCaja } = useCajas()
  const { data: usuariosData, loading: loadingUsuarios, error: errorUsuarios, refetch: refetchUsuarios, eliminarUsuario } = useUsuarios()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null)
  const [deleteReason, setDeleteReason] = useState("")

  const router = useRouter()

  const [totalSuscripciones, setTotalSuscripciones] = useState<number>(0)
  const [gananciaTotal, setGananciaTotal] = useState<number>(0)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const suscripciones = await apiFetch.getSuscripciones()
        const revenue = await apiFetch.getRevenue()
        console.log('Respuesta getSuscripciones:', suscripciones)
        console.log('Respuesta getRevenue:', revenue)
        setTotalSuscripciones(Number(suscripciones?.totalActivas) || 0)
        setGananciaTotal(Number((revenue?.ingresosEsperados || "0").replace(/[^0-9.]/g, "")) || 0)
      } catch (e) {
        setTotalSuscripciones(0)
        setGananciaTotal(0)
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  const handleDeleteBox = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta caja de snacks?")) {
      try {
        await eliminarCaja(id)
        // refetchCajas() // Si el hook no lo hace automáticamente
      } catch (error) {
        console.error("Error al eliminar la caja:", error)
      }
    }
  }

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
  }

  const handleDeleteUser = async (usuario: Usuario) => {
    if (usuario.suscripcionActiva) {
      alert("No se puede eliminar un usuario con una suscripción activa. Por favor, cancela su suscripción primero.")
      return
    }
    setUserToDelete(usuario)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete || !deleteReason.trim()) {
      alert("Por favor, proporciona un motivo para la eliminación")
      return
    }

    try {
      await eliminarUsuario(userToDelete._id)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      setDeleteReason("")
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
    }
  }

  if (loadingCajas || loadingUsuarios || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const stats = {
    totalUsers: usuariosData?.totalUsers || 0,
    totalSubscriptions: totalSuscripciones,
    totalValue: gananciaTotal,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">Snack World</h1>
              <span className="ml-2 text-sm text-gray-500">Panel de Administrador</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Suscripciones</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(stats.totalSubscriptions) || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganancia Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Number(stats.totalValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </CardContent>
          </Card>
        </div>

        {/* Snack Boxes Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Administrar Snack Boxes</h2>
            <Link href="/dashboard/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nueva Caja
              </Button>
            </Link>
          </div>

          {cajas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cajas de snacks aún</h3>
                <p className="text-gray-500 mb-4">Comienza creando tu primera caja de snacks</p>
                <Link href="/dashboard/create">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Caja
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cajas.map((box) => (
                <Card key={box._id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={box.imagen || "/placeholder.svg?height=200&width=300"}
                      alt={box.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{box.nombre}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Globe className="h-4 w-4 mr-1" />
                          {box.pais}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        ${box.precio}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{box.descripcion}</p>
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Productos ({box.productos.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {box.productos.slice(0, 3).map((product, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {box.productos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{box.productos.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/edit/${box._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBox(box._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Users Management Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Administrar Usuarios</h2>
            <Badge variant="secondary" className="text-sm">
              {usuariosData?.usuarios?.length || 0} usuarios registrados
            </Badge>
          </div>

          {!usuariosData?.usuarios || usuariosData.usuarios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios aún</h3>
                <p className="text-gray-500">Los usuarios aparecerán aquí una vez que se registren</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {usuariosData.usuarios.map((usuario) => {
                // Log para depuración
                console.log('Fecha de registro:', usuario.fechaRegistro)
                let fechaValida = ''
                if (usuario.fechaRegistro) {
                  const fecha = new Date(usuario.fechaRegistro)
                  fechaValida = isNaN(fecha.getTime()) ? '' : fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                }
                return (
                  <Card key={usuario._id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{usuario.nombre}</p>
                            {usuario.suscripcionActiva && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Suscripción Activa
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {usuario.correo}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Registrado el {fechaValida || 'Fecha no disponible'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(usuario)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="deleteReason">Motivo de eliminación</Label>
            <Input
              id="deleteReason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Ingresa el motivo de la eliminación"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={!deleteReason.trim()}
            >
              Eliminar Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
