"use client"


import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Link from "next/link"
import { Users, Wifi, Car, Coffee, Tv, Bath, Wind, Star, Filter} from "lucide-react"


const rooms = [
  {
    id: 1,
    name: "Classic Room",
    type: "standard",
    price: 80000,
    originalPrice: 85000,
    image: "/classicOne.jpg",
    gallery: [
      "/classicTwo.jpg",
      "/classicThree.jpg",
      "/classicFour.jpg",
    ],
    size: "35 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description:
      "Elegantly appointed room featuring modern amenities and stunning city views. Perfect for business travelers and couples seeking comfort and luxury.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '55" Smart TV' },
      { icon: Coffee, name: "Coffee Machine" },
      { icon: Bath, name: "Marble Bathroom" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: ["City View", "Work Desk", "Mini Bar", "Safe", "24/7 Room Service", "Daily Housekeeping"],
    rating: 4.8,
    reviews: 124,
    available: true,
  },
  {
    id: 2,
    name: "Superior Suite",
    type: "deluxe",
    price: 98400,
    originalPrice: 120000,
    image: "/superiorOne.jpg",
    gallery: [
      "/superiorTwo.jpg",
      "/superiorThree.jpg",
      "/superiorFour.jpg",
    ],
    size: "65 sqm",
    occupancy: 3,
    bedType: "King Size Bed + Sofa Bed",
    description:
      "Spacious suite with separate living area, perfect for extended stays and business meetings. Includes complimentary breakfast and premium amenities.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '65" Smart TV' },
      { icon: Coffee, name: "Espresso Machine" },
      { icon: Bath, name: "Spa Bathroom" },
      { icon: Wind, name: "Climate Control" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Premium View",
      "Separate Living Area",
      "Dining Table",
      "Butler Service",
      "Complimentary Breakfast",
      "Executive Lounge Access",
    ],
    rating: 4.9,
    reviews: 89,
    available: true,
  },
  {
    id: 3,
    name: "Business Suite",
    type: "business",
    price: 121700,
    originalPrice: 130000,
    image: "/businessOne.jpg",
    gallery: [
      "/businessTwo.jpg",
      "/businessThree.jpg",
      "/businessFour.jpg",
    ],
    size: "120 sqm",
    occupancy: 4,
    bedType: "King Size Bed",
    description:
      "The pinnacle of luxury accommodation featuring multiple bedrooms, private terrace, and personalized service. Ideal for VIPs and special occasions.",
    amenities: [
      { icon: Wifi, name: "Premium Wi-Fi" },
      { icon: Tv, name: "Multiple Smart TVs" },
      { icon: Coffee, name: "Full Kitchen" },
      { icon: Bath, name: "Master Bathroom" },
      { icon: Wind, name: "Smart Climate" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Private Terrace",
      "Multiple Bedrooms",
      "Chef",
      "Valet Parking",
      "24/7 Butler Service",
    ],
    rating: 5.0,
    reviews: 45,
    available: true,
  },
  {
    id: 4,
    name: "Executive Suite",
    type: "suite",
    price: 134700,
    originalPrice: 150000,
    image: "/executiveOne.jpg",
    gallery: [
      "/executiveTwo.jpg",
      "/executiveThree.jpg",
      "/executiveFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  },
  {
    id: 5,
    name: "Ambassadorial Suite",
    type: "suite",
    price: 360000,
    originalPrice: 380000,
    image: "/ambassadorialOne.jpg",
    gallery: [
      "/ambassadorialTwo.jpg",
      "/ambassadorialThree.jpg",
      "/ambassadorialFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  },
  {
    id: 6,
    name: "Presidential Suite",
    type: "suite",
    price: 582000,
    originalPrice: 600000,
    image: "/presidentialOne.jpg",
    gallery: [
      "/presidentialTwo.jpg",
      "/presidentialThree.jpg",
      "/presidentialFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  },

]


export default function RoomsPage(){
    const [filteredRooms, setFilteredRooms] = useState(rooms);
    const [priceRange, setPriceRange] = useState('all');
    const [roomType, setRoomType] = useState('all');
    const [availability, setAvailability] = useState('all');


    const filterRooms = () => {
        let filtered = rooms

        if (priceRange !== "all") {
            const [min, max] = priceRange.split("-").map(Number)
            filtered = filtered.filter((room) => room.price >= min && room.price <= max)
        }

        if (roomType !== "all") {
            filtered = filtered.filter((room) => room.type === roomType)
        }

        if (availability !== 'all'){
            filtered = filtered.filter((room) => room.available === (availability === "available"))
        }

        setFilteredRooms(filtered)
    }

    return (
      <div>
        <section className="relative py-24 min-h-[300px] w-full bg-gradient-to-r from-black/85 to-black/100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-balance">
              Luxury Rooms & Suites
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
              {" "}
              Discover our collection of elegantly appointed accommodations,
              each designed to provide the ultimate in comfort and luxury.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium"> Filter Rooms: </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100000">Under ₦100,000</SelectItem>
                    <SelectItem value="100000-200000">
                      ₦100,000 - ₦200,000
                    </SelectItem>
                    <SelectItem value="200000-600000">
                      Above ₦200,000
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deluxe">Deluxe Room</SelectItem>
                    <SelectItem value="business">Business Room</SelectItem>
                    <SelectItem value="suite">Executive Suite</SelectItem>
                    <SelectItem value="presidential">
                      Presidential Suite
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={filterRooms} variant="outline">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-16">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRooms.map((room) => (
                <Card
                  key={room.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2">
                      <div
                        className="h-64 md:h-full bg-cover bg-center relative"
                        style={{ backgroundImage: `url('${room.image}')` }}
                      >
                        {!room.available && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge
                              variant="destructive"
                              className="text-lg px-4 py-2"
                            >
                              Not Available
                            </Badge>
                          </div>
                        )}
                        {room.originalPrice > room.price && (
                          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                            Save ₦
                            {(room.originalPrice - room.price).toLocaleString()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="md:w-1/2 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-heading text-lg font-semibold mb-2">
                            {room.name}
                          </h3>
                          <div className="flex flex-col  gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex gap-2">
                              <Users className="h-4 w-4" />
                              <span>Up to {room.occupancy} guests</span>
                            </div>
                            <span>• {room.size}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-4 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{room.rating}</span>
                            <span className="text-muted-foreground">
                              ({room.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {room.originalPrice > room.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₦{room.originalPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xl font-semibold text-primary">
                            ₦{room.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per night
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {room.description}
                      </p>

                      {/* Amenities */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {room.amenities.slice(0, 6).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-[10px] text-muted-foreground"
                          >
                            <amenity.icon className="h-3 w-3" />
                            <span>{amenity.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          <Link href={`/rooms/${room.id}`}>View Details</Link>
                        </Button>
                        <Button
                          asChild
                          className="flex-1"
                          disabled={!room.available}
                        >
                          <Link href={`/booking?room=${room.id}`}>
                            {room.available ? "Book Now" : "Unavailable"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No rooms match your current filters.
                </p>
                <Button
                  onClick={() => {
                    setPriceRange("all");
                    setRoomType("all");
                    setAvailability("all");
                    setFilteredRooms(rooms);
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
}