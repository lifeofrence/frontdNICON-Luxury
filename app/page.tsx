"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Wifi, Car, Utensils, Dumbbell, Waves, Coffee, Shield, Clock, MapPin } from "lucide-react"
import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [minDate, setMinDate] = useState("")
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    // Get today's date
    const today = new Date()
    const todayString = formatDateToInput(today)

    // Get tomorrow's date
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = formatDateToInput(tomorrow)

    setMinDate(todayString)
    setCheckInDate(todayString)
    setCheckOutDate(tomorrowString)
  }, [])

  // Helper function to format date as DD-MM-YYYY for display
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}-${month}-${year}`
  }

  // Helper function to format date as YYYY-MM-DD for input value
  const formatDateToInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Handle check-in change and ensure check-out is at least the next day
  const handleCheckInChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCheckInDate(value)

    // If check-out is not set or is on/before the new check-in date, set it to the following day
    if (!checkOutDate || checkOutDate <= value) {
      const nextDay = new Date(value)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOutDate(formatDateToInput(nextDay))
    }
  }

  const handleCheckAvailability = () => {
    // encode params and navigate to booking page
    const params = new URLSearchParams({
      checkIn: checkInDate || "",
      checkOut: checkOutDate || "",
      guests: String(guests || 1),
    })
    router.push(`/booking?${params.toString()}`)
  }

  const features = [
    { icon: Wifi, title: "Free Wi-Fi", description: "High-speed internet throughout the hotel" },
    { icon: Car, title: "Valet Parking", description: "Complimentary parking with valet service" },
    { icon: Utensils, title: "Fine Dining", description: "Multiple restaurants with world-class cuisine" },
    { icon: Dumbbell, title: "Fitness Center", description: "24/7 state-of-the-art gym facilities" },
    { icon: Waves, title: "Swimming Pool", description: "Outdoor pool with poolside service" },
    { icon: Coffee, title: "Room Service", description: "24/7 in-room dining service" },
    { icon: Shield, title: "Security", description: "24/7 security and surveillance" },
    { icon: Clock, title: "Concierge", description: "Personal concierge service available" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content:
        "Exceptional service and luxurious accommodations. The staff went above and beyond to make my stay memorable.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Travel Blogger",
      content: "The perfect blend of modern luxury and Nigerian hospitality. Every detail was thoughtfully considered.",
      rating: 5,
    },
    {
      name: "Amina Kano",
      role: "Event Planner",
      content: "Outstanding venue for our corporate event. The facilities and service exceeded all expectations.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/entranceOne.jpg"
          alt="Nicon Luxury Entrance"
          fill
          priority
          className="object-cover"
        />
        {/* Black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 pointer-events-none" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* <Badge className="mb-4 bg-accent text-accent-foreground">Welcome to Luxury</Badge> */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-balance">
            Experience Unparalleled
            <span className="text-accent block">Luxury in Abuja</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pretty leading-relaxed">
            Discover exceptional hospitality, world-class amenities, and unforgettable experiences in the heart of
            Nigeria&apos;s capital city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/booking">Book Your Stay</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/rooms">Explore Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">Find Your Perfect Stay</h2>
            <p className="text-muted-foreground text-lg">Check availability and book your luxury experience</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={minDate}
                    onChange={handleCheckInChange}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <select
                    value={guests.toString()}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCheckAvailability} className="w-full h-12">
                    Check Availability
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">World-Class Amenities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience luxury at every turn with our comprehensive range of premium amenities and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-slate-50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">Luxury Accommodations</h2>
            <p className="text-muted-foreground text-lg">
              Choose from our selection of elegantly appointed rooms and suites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Classic Room",
                price: "₦80,000",
                image: "/classicOne.jpg",
                features: ["King Size Bed", "City View", "Free Wi-Fi", "Mini Bar"],
              },
              {
                name: "Superior Room ",
                price: "₦98,400",
                image: "/superiorOne.jpg",
                features: ["Separate Living Area", "Premium View", "Complimentary Breakfast", "Room Service"],
              },
              {
                name: "Business Suite",
                price: "₦121,700",
                image: "/businessOne.jpg",
                features: ["Multiple Bedrooms", "Private Terrace", "Personal Chef", "Room Service"],
              },
              {
                name: "Executive Suite",
                price: "₦134,700",
                image: "/executiveOne.jpg",
                features: ["Multiple Bedrooms", "Private Terrace", "Personal Chef", "Room Service"],
              },
              {
                name: "Ambassadorial Suite",
                price: "₦360,000",
                image: "/ambassadorialOne.jpg",
                features: ["Multiple Bedrooms", "Private Terrace", "Personal Chef", "Room Service"],
              },
              {
                name: "Presidential Suite",
                price: "₦582,000",
                image: "/presidentialOne.jpg",
                features: ["Multiple Bedrooms", "Private Terrace", "Personal Chef", "Room Service"],
              },

            ].map((room, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-cover" style={{ backgroundImage: `url('${room.image}')` }} />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-heading text-xl font-semibold">{room.name}</h3>
                    <span className="text-xl font-bold text-primary">{room.price}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {room.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-balance">What Our Guests Say</h2>
            <p className="text-muted-foreground text-lg">
              Discover why guests choose Nicon Luxury Hotel for their stay in Abuja
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-slate-50 duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">&apos;{testimonial.content}&apos;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-balance">Prime Location in Abuja</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Strategically located in the Central Business District, Nicon Luxury Hotel offers easy access to
                government offices, shopping centers, and major attractions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>5 minutes to Aso Rock Presidential Villa</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>10 minutes to National Assembly</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>15 minutes to Nnamdi Azikiwe Airport</span>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link href="/contact">Get Directions</Link>
              </Button>
            </div>
            <div
              className="h-96 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('/entranceOne.jpg')`,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
