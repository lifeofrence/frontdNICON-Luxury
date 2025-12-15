"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, Edit, Trash2, Calendar, Users, DollarSign } from "lucide-react"

const bookings = [
  {
    id: "BK001",
    guest: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+234 801 234 5678",
    room: "Executive Suite 201",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    nights: 3,
    guests: 2,
    status: "confirmed",
    amount: 450000,
    paymentStatus: "paid",
    bookingDate: "2024-01-10",
    specialRequests: "Late check-in requested",
  },
  {
    id: "BK002",
    guest: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+234 802 345 6789",
    room: "Deluxe Room 101",
    checkIn: "2024-01-16",
    checkOut: "2024-01-19",
    nights: 3,
    guests: 1,
    status: "pending",
    amount: 255000,
    paymentStatus: "pending",
    bookingDate: "2024-01-12",
    specialRequests: "",
  },
  {
    id: "BK003",
    guest: "Amina Kano",
    email: "amina.kano@email.com",
    phone: "+234 803 456 7890",
    room: "Presidential Suite 301",
    checkIn: "2024-01-17",
    checkOut: "2024-01-20",
    nights: 3,
    guests: 4,
    status: "confirmed",
    amount: 900000,
    paymentStatus: "paid",
    bookingDate: "2024-01-08",
    specialRequests: "Airport transfer required",
  },
  {
    id: "BK004",
    guest: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+234 804 567 8901",
    room: "Business Room 105",
    checkIn: "2024-01-18",
    checkOut: "2024-01-21",
    nights: 3,
    guests: 1,
    status: "cancelled",
    amount: 285000,
    paymentStatus: "refunded",
    bookingDate: "2024-01-11",
    specialRequests: "",
  },
  {
    id: "BK005",
    guest: "Emma Thompson",
    email: "emma.thompson@email.com",
    phone: "+234 805 678 9012",
    room: "Deluxe Room 102",
    checkIn: "2024-01-20",
    checkOut: "2024-01-23",
    nights: 3,
    guests: 2,
    status: "confirmed",
    amount: 255000,
    paymentStatus: "paid",
    bookingDate: "2024-01-14",
    specialRequests: "Vegetarian meals",
  },
]

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "checked-in":
        return "bg-blue-100 text-blue-800"
      case "checked-out":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = filteredBookings.reduce(
    (sum, booking) => (booking.paymentStatus === "paid" ? sum + booking.amount : sum),
    0,
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold">Booking Management</h1>
            <p className="text-muted-foreground">View and manage all hotel bookings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{filteredBookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredBookings.filter((b) => b.status === "confirmed").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                  <p className="text-2xl font-bold">
                    {filteredBookings.reduce((sum, booking) => sum + booking.guests, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</p>
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
                  placeholder="Search bookings..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guest}</p>
                          <p className="text-sm text-muted-foreground">{booking.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.room}</TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">₦{booking.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No bookings found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
