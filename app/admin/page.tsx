"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Bed,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 2400000, bookings: 45 },
  { month: "Feb", revenue: 2100000, bookings: 38 },
  { month: "Mar", revenue: 2800000, bookings: 52 },
  { month: "Apr", revenue: 3200000, bookings: 61 },
  { month: "May", revenue: 2900000, bookings: 55 },
  { month: "Jun", revenue: 3500000, bookings: 68 },
]

const roomTypeData = [
  { name: "Deluxe Room", value: 45, color: "#164e63" },
  { name: "Executive Suite", value: 25, color: "#8b5cf6" },
  { name: "Business Room", value: 20, color: "#06b6d4" },
  { name: "Presidential Suite", value: 10, color: "#f59e0b" },
]

const recentBookings = [
  {
    id: "BK001",
    guest: "Sarah Johnson",
    room: "Executive Suite",
    checkIn: "2024-01-15",
    checkOut: "2024-01-18",
    status: "confirmed",
    amount: 450000,
  },
  {
    id: "BK002",
    guest: "Michael Chen",
    room: "Deluxe Room",
    checkIn: "2024-01-16",
    checkOut: "2024-01-19",
    status: "pending",
    amount: 255000,
  },
  {
    id: "BK003",
    guest: "Amina Kano",
    room: "Presidential Suite",
    checkIn: "2024-01-17",
    checkOut: "2024-01-20",
    status: "confirmed",
    amount: 900000,
  },
  {
    id: "BK004",
    guest: "David Wilson",
    room: "Business Room",
    checkIn: "2024-01-18",
    checkOut: "2024-01-21",
    status: "cancelled",
    amount: 285000,
  },
]

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7d")

  const stats = [
    {
      title: "Total Revenue",
      value: "₦18.9M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Total Bookings",
      value: "339",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      description: "vs last month",
    },
    {
      title: "Occupancy Rate",
      value: "78.5%",
      change: "-2.1%",
      trend: "down",
      icon: Bed,
      description: "vs last month",
    },
    {
      title: "Active Guests",
      value: "156",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "currently checked in",
    },
  ]

  return (
    <AdminLayout>
      <div className="">
      
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening at your hotel.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Live Site
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      stat.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${(value as number).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#164e63" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Room Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Room Type Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{booking.guest}</p>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.room}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{booking.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{booking.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <Bed className="h-6 w-6" />
                  <span>Add Room</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <Calendar className="h-6 w-6" />
                  <span>New Booking</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <Users className="h-6 w-6" />
                  <span>Guest Check-in</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                  <Clock className="h-6 w-6" />
                  <span>Housekeeping</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">Room 205 maintenance required</p>
                  <p className="text-sm text-yellow-700">Air conditioning unit needs servicing</p>
                </div>
                <Button size="sm" variant="outline">
                  Resolve
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">High occupancy alert</p>
                  <p className="text-sm text-green-700">85% occupancy rate for next week</p>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Pending check-outs</p>
                  <p className="text-sm text-blue-700">12 guests checking out today</p>
                </div>
                <Button size="sm" variant="outline">
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
