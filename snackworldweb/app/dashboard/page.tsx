"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package, DollarSign, Globe, User, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
  const [boxes, setBoxes] = useState<SnackBox[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubscriptions: 0,
    totalValue: 0,
  })
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch boxes
      const boxesResponse = await fetch("/api/cajas")
      if (boxesResponse.ok) {
        const boxesData = await boxesResponse.json()
        setBoxes(boxesData)
      }

      // Fetch admin stats and users
      const adminResponse = await fetch("/api/admin/usuarios")
      if (adminResponse.ok) {
        const adminData = await adminResponse.json()
        setStats({
          totalUsers: adminData.totalUsers || 0,
          totalSubscriptions: adminData.totalSubscriptions || 0,
          totalValue: adminData.totalValue || 0,
        })
        setUsuarios(adminData.usuarios || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBox = async (id: string) => {
    if (confirm("Are you sure you want to delete this snack box?")) {
      try {
        const response = await fetch(`/api/cajas/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchData() // Refresh the data
        }
      } catch (error) {
        console.error("Error deleting box:", error)
      }
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/admin/usuarios/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchData() // Refresh the data
        }
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">Snack World</h1>
              <span className="ml-2 text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscriptions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Snack Boxes Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Snack Boxes</h2>
            <Link href="/dashboard/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Box
              </Button>
            </Link>
          </div>

          {boxes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No snack boxes yet</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first snack box</p>
                <Link href="/dashboard/create">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Box
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxes.map((box) => (
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
                      <p className="text-xs text-gray-500 mb-1">Products ({box.productos.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {box.productos.slice(0, 3).map((product, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {box.productos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{box.productos.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/edit/${box._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
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
            <h2 className="text-xl font-semibold">Manage Users</h2>
            <Badge variant="secondary" className="text-sm">
              {usuarios.length} registered users
            </Badge>
          </div>

          {usuarios.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
                <p className="text-gray-500">Users will appear here once they register</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {usuarios.map((usuario) => (
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
                              Active Subscription
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
                            Joined {new Date(usuario.fechaRegistro).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(usuario._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
