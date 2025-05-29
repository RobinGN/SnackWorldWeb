"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
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

export default function EditBoxPage({ params }: { params: any }) {
  const [formData, setFormData] = useState({
    nombre: "",
    pais: "",
    descripcion: "",
    imagen: "",
    precio: "",
    productos: [] as string[],
  })
  const [newProduct, setNewProduct] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [boxId, setBoxId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof params.then === "function") {
      params.then((resolved: any) => setBoxId(resolved.id))
    } else {
      setBoxId(params.id)
    }
  }, [params])

  useEffect(() => {
    if (boxId) {
      fetchBox(boxId)
    }
  }, [boxId])

  const fetchBox = async (id: string) => {
    try {
      const box = await apiFetch.getCajaById(id)
      setFormData({
        nombre: box.nombre,
        pais: box.pais,
        descripcion: box.descripcion,
        imagen: box.imagen,
        precio: box.precio.toString(),
        productos: box.productos,
      })
    } catch (error) {
      setError("Hubo un error al cargar la SnackBox")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.productos.length === 0) {
      setError("Por favor, agrega al menos un producto")
      setLoading(false)
      return
    }

    try {
      if (!boxId) throw new Error("No box id")
      await apiFetch.actualizarCaja(boxId, {
        ...formData,
        precio: Number.parseFloat(formData.precio),
      })
      router.push("/dashboard")
    } catch (err) {
      setError("Fallo al actualizar la SnackBox. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const addProduct = () => {
    if (newProduct.trim() && !formData.productos.includes(newProduct.trim())) {
      setFormData({
        ...formData,
        productos: [...formData.productos, newProduct.trim()],
      })
      setNewProduct("")
    }
  }

  const removeProduct = (index: number) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index),
    })
  }

  if (initialLoading) {
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
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar al Panel de Administrador
            </Link>
            <h1 className="ml-4 text-xl font-semibold">Editar SnackBox</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar SnackBox</CardTitle>
            <CardDescription>Actualizar la información de la SnackBox</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la SnackBox</Label>
                  <Input
                    id="nombre"
                    placeholder="Escribe el nombre de la SnackBox"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input
                    id="pais"
                    placeholder="País de origen"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe qué hace especial a esta SnackBox..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imagen">URL de la Imagen</Label>
                  <Input
                    id="imagen"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio">Precio ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Productos en esta SnackBox</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agrega los productos que contendrá la SnackBox"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProduct())}
                  />
                  <Button type="button" onClick={addProduct} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.productos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.productos.map((product, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {product}
                        <button type="button" onClick={() => removeProduct(index)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar Snack Box"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
