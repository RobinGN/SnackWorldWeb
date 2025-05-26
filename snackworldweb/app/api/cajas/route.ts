import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with your actual database
const mockBoxes = [
  {
    _id: "1",
    nombre: "Traditional Japanese Sweets",
    pais: "Japan",
    descripcion: "A carefully curated selection of Japanese candies, desserts, and teas from local makers",
    imagen: "/placeholder.svg?height=400&width=600",
    precio: 25,
    productos: ["Pocky Sticks", "KitKat Matcha", "Mochi", "Dorayaki"],
  },
  {
    _id: "2",
    nombre: "Italian Dessert Box",
    pais: "Italy",
    descripcion: "Multiple traditional snacks from Italy including chocolates and biscotti",
    imagen: "/placeholder.svg?height=400&width=600",
    precio: 30,
    productos: ["Biscotti", "Amaretti", "Cannoli Chips", "Espresso Chocolate"],
  },
]

export async function GET() {
  return NextResponse.json(mockBoxes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newBox = {
      _id: Date.now().toString(),
      ...body,
    }

    mockBoxes.push(newBox)

    return NextResponse.json(newBox, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create box" }, { status: 500 })
  }
}
