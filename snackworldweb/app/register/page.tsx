"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.contrasena !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
        }),
      })

      if (response.ok) {
        router.push("/login?message=Registration successful")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-orange-500">Snack World</CardTitle>
          <CardDescription>Create your vendor account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nombre">Full Name</Label>
              <Input
                id="nombre"
                placeholder="Enter your full name"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Email</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Enter your email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena">Password</Label>
              <Input
                id="contrasena"
                type="password"
                placeholder="Enter your password"
                value={formData.contrasena}
                onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
