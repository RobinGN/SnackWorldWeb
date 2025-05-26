"use client"

import type React from "react"

import { useState } from "react"
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

export default function CreateBoxPage() {
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
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.productos.length === 0) {
      setError("Please add at least one product")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/cajas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          precio: Number.parseFloat(formData.precio),
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError("Failed to create snack box. Please try again.")
      }
    } catch (err) {
      setError("Failed to create snack box. Please try again.")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="ml-4 text-xl font-semibold">Create New Snack Box</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Snack Box</CardTitle>
            <CardDescription>Fill in the details below to create a new snack box for your customers</CardDescription>
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
                  <Label htmlFor="nombre">Box Name</Label>
                  <Input
                    id="nombre"
                    placeholder="e.g., Traditional Japanese Sweets"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">Country</Label>
                  <Input
                    id="pais"
                    placeholder="e.g., Japan"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Description</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe what makes this snack box special..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imagen">Image URL</Label>
                  <Input
                    id="imagen"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio">Price ($)</Label>
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
                <Label>Products in this box</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a product (e.g., Pocky Sticks)"
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
                  {loading ? "Creating..." : "Create Snack Box"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
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
