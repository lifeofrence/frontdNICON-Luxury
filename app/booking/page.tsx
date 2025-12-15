"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CreditCard, Shield, Clock, CheckCircle, Building2, Smartphone, AlertCircle } from "lucide-react"

// Fallback rooms for initial render or when API fails
const fallbackRooms = [
  {
    id: 1,
    name: "Classic Room",
    type: "standard",
    price: 80000,
    originalPrice: 85000,
    image: "/classicOne.jpg"
  },
  {
    id: 2,
    name: "Superior Suite",
    type: "deluxe",
    price: 98400,
    originalPrice: 120000,
    image: "/superiorOne.jpg"
  },
  {
    id: 3,
    name: "Business Suite",
    type: "business",
    price: 121700,
    originalPrice: 130000,
    image: "/businessOne.jpg"
  },
  {
    id: 4,
    name: "Executive Suite",
    type: "suite",
    price: 134700,
    originalPrice: 150000,
    image: "/executiveOne.jpg"
  },
  {
    id: 5,
    name: "Ambassadorial Suite",
    type: "suite",
    price: 360000,
    originalPrice: 380000,
    image: "/ambassadorialOne.jpg"
  },
  {
    id: 6,
    name: "Presidential Suite",
    type: "suite",
    price: 582000,
    originalPrice: 600000,
    image: "/presidentialOne.jpg"
  }
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get("room")
  const [selectedRoom, setSelectedRoom] = useState<number | null>(roomId ? Number.parseInt(roomId) : null)
  const [step, setStep] = useState(1)
  const checkInParam = searchParams.get("checkIn") ?? ""
  const checkOutParam = searchParams.get("checkOut") ?? ""
  const guestsParam = searchParams.get("guests")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  type Notice = { type: "error" | "success" | "info"; message: string } | null
  const [notice, setNotice] = useState<Notice>(null)
  type ServerBooking = {
    id: number
    guest_name: string
    guest_email: string
    guest_phone: string
    status: string
    amount: number
    check_in_date: string
    check_out_date: string
    room?: { id: number; room_number: string; status: string } | null
    roomType?: { id: number; name: string } | null
  }
  const [serverBooking, setServerBooking] = useState<ServerBooking | null>(null)
  const formatHotelDate = (dateStr: string) => {
    // Accept both ISO strings (e.g. 2025-12-02T00:00:00.000Z) and YYYY-MM-DD
    let base: Date | null = null
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      const parsed = new Date(dateStr)
      if (!isNaN(parsed.getTime())) {
        base = parsed
      }
    }
    if (!base && typeof dateStr === "string") {
      const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (m) {
        const [, y, mo, d] = m
        base = new Date(Number(y), Number(mo) - 1, Number(d), 12, 0, 0)
      }
    }
    if (!base) {
      // Fallback: try Date constructor; if still invalid, return original string
      const fallback = new Date(dateStr)
      if (isNaN(fallback.getTime())) return `${dateStr} at 12:00 PM`
      base = fallback
    }
    // Normalize time to 12:00 PM local
    const d = new Date(base)
    d.setHours(12, 0, 0, 0)
    return `${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })} at 12:00 PM`
  }
  type BookingData = {
    checkIn: string
    checkOut: string
    guests: number
    rooms: number
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    specialRequests: string
    newsletter: boolean
    terms: boolean
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
    billingAddress: string
    billingCity: string
    billingState: string
    billingZip: string
  }


  // initialize bookingData from URL params when available
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // safe local ISO string (YYYY-MM-DD)
    const toLocalISOByDate = (d: Date) => {
      const offset = d.getTimezoneOffset()
      const local = new Date(d.getTime() - (offset * 60 * 1000))
      return local.toISOString().split('T')[0]
    }

    const todayStr = toLocalISOByDate(today)
    const tomorrowStr = toLocalISOByDate(tomorrow)

    return {
      checkIn: checkInParam || todayStr,
      checkOut: checkOutParam || tomorrowStr,
      guests: guestsParam ? Number.parseInt(guestsParam) : 1,
      rooms: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      specialRequests: "",
      newsletter: false,
      terms: false,
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: ""
    }
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://niconluxury.jubileesystem.com"


  // helper: convert YYYY-MM-DD -> DD-MM-YYYY (backend expects this format based on your Postman)
  function toDDMMYYYY(isoDate?: string) {
    if (!isoDate) return ""
    const [y, m, d] = isoDate.split("-")
    return `${d}-${m}-${y}`
  }

  type CreateBookingApiPayload = {
    room_type_id: number
    guest_name: string
    guest_email: string
    guest_phone: string
    check_in_date: string // DD-MM-YYYY
    check_out_date: string // DD-MM-YYYY
    status?: string
    amount: number | string
    number_of_rooms?: number
    // add other optional fields the API supports, e.g. special_requests
    special_requests?: string
  }


  const createBooking = async (payload: CreateBookingApiPayload) => {
    // Use local Next.js API route as proxy to avoid CORS issues
    const url = `/api/bookings`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      // Extract error message from proxy API response
      let message = `Booking failed with status ${res.status}`
      try {
        const errJson = await res.json()
        // The proxy returns { error: string, details: any }
        if (errJson && typeof errJson.error === "string") {
          message = errJson.error
        } else if (errJson && typeof errJson.message === "string") {
          message = errJson.message
        }
      } catch (_) {
        const text = await res.text()
        message = text || message
      }
      throw new Error(message)
    }
    return res.json()
  }

  // Types for /api/rooms
  type ApiRoomImage = {
    secure_url?: string | null
    url?: string | null
    caption?: string | null
  }
  type ApiRoomType = {
    id: number
    name: string
    base_price: number
    images?: ApiRoomImage[]
  }
  type UiRoom = {
    id: number
    name: string
    price: number
    image?: string | null
  }

  const [apiRooms, setApiRooms] = useState<UiRoom[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Use local Next.js API route as proxy to avoid CORS issues
        const res = await fetch(`/api/rooms`, { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Rooms API error: ${res.status}`)
        }
        const json: ApiRoomType[] = await res.json()
        const mapped: UiRoom[] = (json || []).map((r: ApiRoomType) => {
          const firstImg = r.images && r.images.length > 0 ? r.images[0] : undefined
          const imgUrl = firstImg?.secure_url || firstImg?.url || null
          return {
            id: r.id,
            name: r.name,
            price: Number(r.base_price) || 0,
            image: imgUrl,
          }
        })
        setApiRooms(mapped)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load rooms."
        setNotice({ type: "error", message })
      }
    }
    fetchRooms()
  }, [])

  const uiRooms: UiRoom[] = apiRooms.length > 0 ? apiRooms : fallbackRooms

  // if search params change while on page, keep bookingData in sync
  useEffect(() => {
    if (checkInParam || checkOutParam || guestsParam) {
      setBookingData((prev) => ({
        ...prev,
        checkIn: checkInParam || prev.checkIn,
        checkOut: checkOutParam || prev.checkOut,
        guests: guestsParam ? Number.parseInt(guestsParam) : prev.guests,
      }))
    }
  }, [checkInParam, checkOutParam, guestsParam])

  const selectedRoomData = uiRooms.find((room) => room.id === selectedRoom)
  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
        (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
      )
      : 0
  const subtotal = selectedRoomData ? selectedRoomData.price * nights * bookingData.rooms : 0
  // const taxes = subtotal * 0.075 // 7.5% VAT
  const taxes = 0
  const total = subtotal + taxes

  function handleInputChange<K extends keyof BookingData>(field: K, value: BookingData[K]) {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // build payload according to the API you tested
      const guestName = `${bookingData.firstName} ${bookingData.lastName}`.trim() || "Guest"
      // map frontend selectedRoom to backend room_type_id
      // IMPORTANT: ensure your frontend room IDs match backend room_type_id; if not, add mapping
      if (!selectedRoom) throw new Error("Please select a room first.")
      const room_type_id = selectedRoom as number

      const payload: CreateBookingApiPayload = {
        room_type_id,
        guest_name: guestName,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        // Convert dates to DD-MM-YYYY format as backend expects
        check_in_date: toDDMMYYYY(bookingData.checkIn),
        check_out_date: toDDMMYYYY(bookingData.checkOut),
        status: "pending",
        amount: Number((total).toFixed(2)), // adjust if API expects different unit
        number_of_rooms: bookingData.rooms,
        special_requests: bookingData.specialRequests || undefined,
      }

      const apiResult = await createBooking(payload)

      // Do not auto-initiate payment; capture booking info and show it inline
      const booking = apiResult.booking || null
      setServerBooking(booking)
      // Optionally, surface how many rooms were booked in the UI via alert
      if (apiResult?.number_of_rooms) {
        console.log(`Rooms booked: ${apiResult.number_of_rooms}`)
      }
      setNotice({ type: "success", message: "Booking created successfully!" })
      setStep(2) // keep user on details step
    } catch (error) {
      console.error("Booking/payment error:", error)
      let msg = "Booking failed. Please try again."

      if (error instanceof Error) {
        msg = error.message
        // Check if it's a validation error with more details
        if (msg.includes("422") || msg.includes("validation")) {
          msg = "Please check your booking details. Some fields may be invalid or the room may not be available for the selected dates."
        }
      }

      setNotice({ type: "error", message: msg })
    } finally {
      setIsProcessing(false)
    }
  }


  // Mock payment processing functions



  type CardPaymentData = {
    amount: number
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
  }

  type CardPaymentResult = {
    success: boolean
    bookingId: string
    transactionId: string
    error?: string
  }

  type BankTransferDetails = {
    reference: string
    accountNumber: string
    bankName: string
    accountName: string
  }

  type PaystackInitResult = {
    authorization_url: string
    access_code: string
    reference: string
  }

  type BookingResult = {
    bookingId: string
    status: string
  }

  const processCardPayment = async (paymentData: CardPaymentData): Promise<CardPaymentResult> => {
    // In a real app, this would integrate with Stripe, Square, etc.
    return {
      success: true,
      bookingId: "BK" + Date.now(),
      transactionId: "TXN" + Date.now(),
    }
  }

  const generateBankTransfer = async (transferData: { amount: number; guestName: string; email: string; }): Promise<BankTransferDetails> => {
    return {
      reference: "REF" + Date.now(),
      accountNumber: "0123456789",
      bankName: "First Bank of Nigeria",
      accountName: "Nicon Luxury Hotel Ltd",
    }
  }

  const initializePaystack = async (paystackData: { amount: number; email: string; firstName: string; lastName: string; }): Promise<PaystackInitResult> => {
    return {
      authorization_url: "https://checkout.paystack.com/example",
      access_code: "access_code_example",
      reference: "ref_" + Date.now(),
    }
  }

  type CreateBookingPayload = BookingData & {
    paymentMethod: string
    paymentStatus: string
  }

  const createBookingMock = async (bookingData: CreateBookingPayload): Promise<BookingResult> => {
    return {
      bookingId: "BK" + Date.now(),
      status: "confirmed",
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Indicator */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:space-x-8">
              {[
                { step: 1, title: "Room & Dates", icon: Calendar },
                { step: 2, title: "Guest Details", icon: Users },
                { step: 3, title: "Payment", icon: CreditCard },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= item.step
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                      }`}
                  >
                    {step > item.step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium ${step >= item.step
                      ? "text-primary"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.title}
                  </span>
                  {index < 2 && <div className="w-16 h-0.5 bg-border ml-4 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Progress Indicator */}
      {/* <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {[
                { step: 1, title: "Room & Dates", icon: Calendar },
                { step: 2, title: "Guest Details", icon: Users },
                { step: 3, title: "Payment", icon: CreditCard },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= item.step
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                      }`}
                  >
                    {step > item.step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium ${step >= item.step
                      ? "text-primary"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.title}
                  </span>
                  {index < 2 && <div className="w-16 h-0.5 bg-border ml-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notice && notice.type === "success" && (
          <div className="mb-6 border border-green-200 bg-green-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800">{notice.message}</p>
              </div>
              <button onClick={() => setNotice(null)} className="text-sm text-green-700 underline">Dismiss</button>
            </div>
          </div>
        )}
        {notice && notice.type === "error" && (
          <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">{notice.message}</p>
                <p className="text-sm text-red-700 mt-1">Please adjust the number of rooms or choose a different room type/date.</p>
              </div>
              <button onClick={() => setNotice(null)} className="text-sm text-red-700 underline">Dismiss</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            {serverBooking && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Booking Created
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Booking ID:</strong> NLA{serverBooking.id}</p>
                  <p><strong>Name:</strong> {serverBooking.guest_name}</p>
                  <p><strong>Email:</strong> {serverBooking.guest_email}</p>
                  <p><strong>Phone:</strong> {serverBooking.guest_phone}</p>
                  <p><strong>Status:</strong> {serverBooking.status}</p>
                  <p><strong>Amount:</strong> ₦{Number(serverBooking.amount).toLocaleString()}</p>
                  <p><strong>Check-in:</strong> {formatHotelDate(serverBooking.check_in_date)}</p>
                  <p><strong>Check-out:</strong> {formatHotelDate(serverBooking.check_out_date)}</p>

                </CardContent>
              </Card>
            )}
            {/* Step 1: Room & Dates */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Select Room & Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkin">Check-in Date</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) =>
                          handleInputChange("checkIn", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Check-in time is 12:00 PM</p>
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check-out Date</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) =>
                          handleInputChange("checkOut", e.target.value)
                        }
                        min={
                          bookingData.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">Check-out time is 12:00 PM</p>
                    </div>
                    {/* Guests and Rooms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guests">Number of Guests</Label>
                        <Select
                          value={bookingData.guests.toString()}
                          onValueChange={(value) =>
                            handleInputChange("guests", Number.parseInt(value))
                          }

                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4 Guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>


                      <div>
                        <Label htmlFor="rooms">Number of Rooms</Label>
                        <div className="flex items-center border rounded-md h-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full px-3 rounded-none border-r hover:bg-muted"
                            onClick={() => handleInputChange("rooms", Math.max(1, bookingData.rooms - 1))}
                            disabled={bookingData.rooms <= 1}
                          >
                            <span className="text-lg font-medium">-</span>
                          </Button>
                          <div className="flex-1 text-center font-medium">
                            {bookingData.rooms}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-full px-3 rounded-none border-l hover:bg-muted"
                            onClick={() => handleInputChange("rooms", bookingData.rooms + 1)}
                          >
                            <span className="text-lg font-medium">+</span>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Select number of rooms.</p>
                      </div>
                    </div>
                  </div>


                  {/* Room Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Choose Your Room
                    </Label>
                    <div className="space-y-4">
                      {uiRooms.map((room) => (
                        <div key={room.id}>
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedRoom === room.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                            onClick={() => setSelectedRoom(room.id)}
                          >
                            <div className="flex gap-4">
                              <div className="relative w-32 h-24 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={room.image || "/placeholder.svg"}
                                  alt={room.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{room.name}</h3>
                                <p className="text-primary font-bold text-xl">
                                  ₦{room.price.toLocaleString()}
                                  <span className="text-sm text-muted-foreground">/night</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Show booking details immediately after selected room */}
                          {selectedRoom === room.id && (
                            <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-4">
                              {/* Booking Summary */}
                              <div className="bg-white rounded-lg p-4 space-y-3">
                                <h4 className="font-semibold text-lg">Booking Summary</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Room Type</span>
                                    <span className="font-medium">{room.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Check-in</span>
                                    <span className="font-medium">
                                      {bookingData.checkIn ? new Date(bookingData.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Check-out</span>
                                    <span className="font-medium">
                                      {bookingData.checkOut ? new Date(bookingData.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Number of Nights</span>
                                    <span className="font-medium">{nights > 0 ? nights : '-'}</span>
                                  </div>
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        ₦{room.price.toLocaleString()} × {nights > 0 ? nights : 0} night{nights !== 1 ? 's' : ''} × {bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}
                                      </span>
                                      <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                                    </div>
                                    {/* <div className="flex justify-between mt-1">
                                      <span className="text-muted-foreground">Taxes (7.5%)</span>
                                      <span className="font-medium">₦{taxes.toLocaleString()}</span>
                                    </div> */}
                                  </div>
                                  <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">₦{total.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>



                              <Button
                                onClick={handleNextStep}
                                className="w-full"
                                disabled={!bookingData.checkIn || !bookingData.checkOut || !selectedRoom}
                              >
                                Continue to Guest Details
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Guest Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={bookingData.country || "nigeria"}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="south-africa">
                          South Africa
                        </SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> 
                  !bookingData.country
                  */}

                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any special requests or requirements..."
                      value={bookingData.specialRequests}
                      onChange={(e) =>
                        handleInputChange("specialRequests", e.target.value)
                      }
                    />
                  </div>
                  {/* 
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={bookingData.newsletter}
                        onCheckedChange={(checked) =>
                          handleInputChange("newsletter", Boolean(checked))
                        }
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Subscribe to our newsletter for exclusive offers and
                        updates
                      </Label>
                    </div>
                  </div> */}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 bg-transparent"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-1"
                      disabled={
                        !bookingData.firstName ||
                        !bookingData.lastName ||
                        !bookingData.email ||
                        !bookingData.phone

                      }
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Shield className="h-5 w-5" />
                      <span className="font-semibold">Secure Payment</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Your payment information is encrypted and secure. We
                      support multiple payment methods for your convenience.
                    </p>
                  </div>

                  <div>
                    {/* <Label className="text-base font-semibold mb-4 block">
                      Choose Payment Method
                    </Label>
                    <label
                      className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${paymentMethod === "card" ? "ring-2 ring-primary" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <CreditCard className="h-6 w-6 text-primary" />
                        <div>
                          <span className="font-medium">Credit/Debit Card</span>
                          <p className="text-sm text-muted-foreground">
                            Visa, Mastercard
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Image src="/Visa.png" alt="Visa" width={40} height={24} className="object-contain" />
                        <Image src="/Mastercard.png" alt="Mastercard" width={40} height={24} className="object-contain" />
                      </div>
                    </label> */}

                    {/* Paystack */}
                    <label
                      className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${paymentMethod === "paystack"
                        ? "ring-2 ring-primary"
                        : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paystack"
                        checked={paymentMethod === "paystack"}
                        onChange={() => setPaymentMethod("paystack")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="h-6 w-6 text-green-600" />
                        <div>
                          <span className="font-medium">Paystack</span>
                          <p className="text-sm text-muted-foreground">
                            Card, Bank Transfer, USSD
                          </p>
                        </div>
                      </div>
                      {/* <Badge className="bg-green-100 text-green-800">
                        Recommended
                      </Badge> */}
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${paymentMethod === "bank" ? "ring-2 ring-primary" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        <div>
                          <span className="font-medium">Bank Transfer</span>
                          <p className="text-sm text-muted-foreground">
                            Direct bank transfer
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Pay at Hotel */}
                    <label
                      className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${paymentMethod === "hotel" ? "ring-2 ring-primary" : ""
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="hotel"
                        checked={paymentMethod === "hotel"}
                        onChange={() => setPaymentMethod("hotel")}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Clock className="h-6 w-6 text-orange-600" />
                        <div>
                          <span className="font-medium">Pay at Hotel</span>
                          <p className="text-sm text-muted-foreground">
                            Cash or card on arrival
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* {paymentMethod === "card" && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-semibold">Card Details</h3>
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={bookingData.cardNumber}
                          onChange={(e) =>
                            handleInputChange("cardNumber", e.target.value)
                          }
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={bookingData.expiryDate}
                            onChange={(e) =>
                              handleInputChange("expiryDate", e.target.value)
                            }
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={bookingData.cvv}
                            onChange={(e) =>
                              handleInputChange("cvv", e.target.value)
                            }
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={bookingData.cardName}
                          onChange={(e) =>
                            handleInputChange("cardName", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Billing Address</h4>
                        <div>
                          <Label htmlFor="billingAddress">Address *</Label>
                          <Input
                            id="billingAddress"
                            placeholder="123 Main Street"
                            value={bookingData.billingAddress}
                            onChange={(e) =>
                              handleInputChange(
                                "billingAddress",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                              id="billingCity"
                              placeholder="Lagos"
                              value={bookingData.billingCity}
                              onChange={(e) =>
                                handleInputChange("billingCity", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">State *</Label>
                            <Input
                              id="billingState"
                              placeholder="Lagos"
                              value={bookingData.billingState}
                              onChange={(e) =>
                                handleInputChange(
                                  "billingState",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {paymentMethod === "paystack" && (
                    <div className="border-t pt-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">
                            Paystack Payment
                          </span>
                        </div>
                        <p className="text-green-700 text-sm">
                          You will be redirected to Paystack to complete your
                          payment securely. Paystack supports cards, bank
                          transfers, and mobile money.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                          <Building2 className="h-5 w-5" />
                          <span className="font-semibold">Bank Transfer</span>
                        </div>
                        <p className="text-blue-700 text-sm mb-3">
                          You will receive bank transfer details after
                          confirming your booking. Payment must be completed
                          within 24 hours.
                        </p>
                        <div className="text-sm text-blue-700">
                          <p>
                            <strong>Account Name:</strong> Nicon Luxury Hotel
                            Ltd
                          </p>
                          <p>
                            <strong>Bank:</strong> First Bank of Nigeria
                          </p>
                          <p>
                            <strong>Account Number:</strong> Will be provided
                            after booking
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "hotel" && (
                    <div className="border-t pt-6">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">Pay at Hotel</span>
                        </div>
                        <p className="text-orange-700 text-sm">
                          Your booking will be confirmed and you can pay upon
                          arrival at the hotel. We accept cash, credit cards,
                          and bank transfers.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 border-t pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={bookingData.terms}
                        onCheckedChange={(checked) =>
                          handleInputChange("terms", Boolean(checked))
                        }
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Privacy Policy
                        </a>
                      </Label>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Free cancellation up to 24 hours before check-in</p>
                      <p>• No hidden fees - total price includes all taxes</p>

                      <p>• Instant booking confirmation via email</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 bg-transparent"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      className="flex-1"
                      disabled={!bookingData.terms || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Complete Booking - ₦${total.toLocaleString()}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar - Only show on steps 2 and 3 */}
          {step > 1 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRoomData && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={selectedRoomData.image || "/placeholder.svg"}
                            alt={selectedRoomData.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {selectedRoomData.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ₦{selectedRoomData.price.toLocaleString()}/night
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Check-in:</span>
                          <span>{bookingData.checkIn || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Check-out:</span>
                          <span>{bookingData.checkOut || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{bookingData.guests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rooms:</span>
                          <span>{bookingData.rooms}</span>
                        </div>
                        {nights > 0 && (
                          <div className="flex justify-between">
                            <span>Nights:</span>
                            <span>{nights}</span>
                          </div>
                        )}
                      </div>

                      {nights > 0 && (
                        <>
                          <div className="border-t pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Room rate ({nights} nights)</span>
                              <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            {/* <div className="flex justify-between">
                              <span>Taxes & fees</span>
                              <span>₦{taxes.toLocaleString()}</span>
                            </div> */}
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>Total</span>
                              <span className="text-primary">
                                ₦{total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {serverBooking && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2 text-green-800 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Booking Successful!</span>
                          </div>
                          <p className="text-green-700 text-xs mt-1">
                            Your reservation NLA{serverBooking.id} has been confirmed.
                          </p>
                        </div>
                      )}

                      {/* <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-800 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Free cancellation</span>
                        </div>
                        <p className="text-green-700 text-xs mt-1">
                          Cancel up to 24 hours before check-in
                        </p>
                      </div> */}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div >
    </div >
  );
}
