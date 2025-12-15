"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Eye, Users, Bed, DollarSign } from "lucide-react"

const rooms = [
  {
    id: 1,
    number: "101",
    name: "Deluxe Room",
    type: "deluxe",
    status: "available",
    price: 85000,
    capacity: 2,
    size: "35 sqm",
    amenities: ["Wi-Fi", "TV", "Mini Bar", "AC"],
    image: "/luxury-hotel-room-modern-elegant-bed.jpg",
    lastCleaned: "2024-01-15 10:30",
    nextBooking: "2024-01-18",
  },
  {
    id: 2,
    number: "102",
    name: "Deluxe Room",
    type: "deluxe",
    status: "occupied",
    price: 85000,
    capacity: 2,
    size: "35 sqm",
    amenities: ["Wi-Fi", "TV", "Mini Bar", "AC"],
    image: "/luxury-hotel-room-modern-elegant-bed.jpg",
    lastCleaned: "2024-01-14 09:15",
    nextBooking: null,
    currentGuest: "Sarah Johnson",
    checkOut: "2024-01-18",
  },
  {
    id: 3,
    number: "201",
    name: "Executive Suite",
    type: "suite",
    status: "maintenance",
    price: 150000,
    capacity: 3,
    size: "65 sqm",
    amenities: ["Wi-Fi", "TV", "Kitchen", "Living Area"],
    image: "/luxury-hotel-suite-living-room-elegant-furniture.jpg",
    lastCleaned: "2024-01-13 14:20",
    nextBooking: "2024-01-20",
    maintenanceNote: "Air conditioning repair needed",
  },
  {
    id: 4,
    number: "301",
    name: "Presidential Suite",
    type: "presidential",
    status: "available",
    price: 300000,
    capacity: 4,
    size: "120 sqm",
    amenities: ["Wi-Fi", "TV", "Full Kitchen", "Terrace"],
    image: "/presidential-suite-luxury-hotel-spacious-elegant.jpg",
    lastCleaned: "2024-01-15 11:45",
    nextBooking: "2024-01-25",
  },
]

export default function AdminRoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      case "cleaning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold">Room Management</h1>
            <p className="text-muted-foreground">Manage hotel rooms, pricing, and availability</p>
          </div>
          <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>Create a new room in the hotel inventory</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" placeholder="e.g., 105" />
                </div>
                <div>
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input id="roomName" placeholder="e.g., Deluxe Room" />
                </div>
                <div>
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deluxe">Deluxe Room</SelectItem>
                      <SelectItem value="business">Business Room</SelectItem>
                      <SelectItem value="suite">Executive Suite</SelectItem>
                      <SelectItem value="presidential">Presidential Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price per Night (₦)</Label>
                  <Input id="price" type="number" placeholder="85000" />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="2" />
                </div>
                <div>
                  <Label htmlFor="size">Room Size</Label>
                  <Input id="size" placeholder="35 sqm" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Textarea id="amenities" placeholder="Wi-Fi, TV, Mini Bar, AC..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddRoomOpen(false)}>Add Room</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </div>
                <Bed className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {rooms.filter((r) => r.status === "available").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupied</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {rooms.filter((r) => r.status === "occupied").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Rate</p>
                  <p className="text-2xl font-bold">
                    ₦{Math.round(rooms.reduce((acc, room) => acc + room.price, 0) / rooms.length).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  <SelectItem value="business">Business Room</SelectItem>
                  <SelectItem value="suite">Executive Suite</SelectItem>
                  <SelectItem value="presidential">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative">
                <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(room.status)}`}>{room.status}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Room {room.number}</h3>
                    <p className="text-sm text-muted-foreground">{room.name}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">₦{room.price.toLocaleString()}</p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span>{room.capacity} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{room.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Cleaned:</span>
                    <span>{new Date(room.lastCleaned).toLocaleDateString()}</span>
                  </div>
                  {room.currentGuest && (
                    <div className="flex justify-between">
                      <span>Guest:</span>
                      <span>{room.currentGuest}</span>
                    </div>
                  )}
                  {room.maintenanceNote && (
                    <div className="text-red-600 text-xs">
                      <span className="font-medium">Note:</span> {room.maintenanceNote}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No rooms found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
