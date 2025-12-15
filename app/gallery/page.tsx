"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All" },
    { id: "rooms", name: "Rooms & Suites" },
    { id: "dining", name: "Dining" },
    { id: "facilities", name: "Facilities" },
    { id: "events", name: "Events" },
    { id: "exterior", name: "Exterior" },
  ]

  const images = [
    { src: "/yardOne.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/yardTwo.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/yardThree.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/yardFour.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/receptionOne.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/entranceTwo.jpg", category: "exterior", title: "Hotel Exterior" },
    { src: "/nicon_1.jpg", category: "exterior", title: "Hotel Exterior" },

    { src: "/classicOne.jpg", category: "rooms", title: "Classic Room" },
    { src: "/superiorOne.jpg", category: "rooms", title: "Superior Room" },
    { src: "/executiveOne.jpg", category: "rooms", title: "Executive Suite" },
    { src: "/ambassadorialOne.jpg", category: "rooms", title: "Ambassadorial Suite" },
    { src: "/presidentialOne.jpg", category: "rooms", title: "Presidential Suite" },
    { src: "/conferenceOne.jpg", category: "dining", title: "Mediterrenean Bar" },
    { src: "/poolOne.jpg", category: "facilities", title: "Swimming Pool" },
    { src: "/gymOne.jpg", category: "facilities", title: "Fitness Center" },
    { src: "/gymTwo.jpg", category: "facilities", title: "Fitness Center" },
    { src: "/spaOne.jpg", category: "facilities", title: "Spa & Wellness" },
    { src: "/conferenceTwo.jpg", category: "events", title: "Obafemi Owolowo Hall" },
    { src: "/tennisCourtOne.jpg", category: "facilities", title: "Tennis & Squash Court" },
    { src: "/toiletOne.jpg", category: "rooms", title: "Toilet" },
    { src: "/yardTwo.jpg", category: "exterior", title: "Conference Hall Entrance" },
  ]

  const filteredImages = selectedCategory === "all" ? images : images.filter((img) => img.category === selectedCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 flex items-center justify-center min-h-[50vh]">
        <Image
          src="/yardThree.jpg"
          alt="Nicon Luxury Hotel Gallery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance ">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl opacity-90 text-balance">
            Explore the beauty and elegance of Nicon Luxury Hotel
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <Card
              key={index}
              className="overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Gallery image"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
