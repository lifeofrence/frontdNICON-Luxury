"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("[v0] Contact form submitted:", formData)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["Nicon Luxury Hotel", "Plot 903, Tafawa Balewa Way", "Central Business District", "Abuja, Nigeria"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 701 7746 844"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@niconluxury.com"],
    },
    {
      icon: Clock,
      title: "Reception Hours",
      details: ["24/7 Front Desk", "Check-in: 1:00 PM", "Check-out: 12:00 PM"],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <Image src="/receptionOne.jpg" alt="Contact Us" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 text-balance">We&apos;re here to assist you 24/7</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Contact Form and Map */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="mt-2"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Map */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">Find Us</h2>
            <Card className="overflow-hidden h-[500px]">
              <div className="relative w-full h-full bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9876543210123!2d7.4905!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDMnMjguNCJOIDfCsDI5JzI1LjgiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nicon Luxury Hotel Location"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <info.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold mb-3">{info.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
