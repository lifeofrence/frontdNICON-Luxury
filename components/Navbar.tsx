'use client'

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import {Menu, X, Phone}  from "lucide-react"
import { usePathname } from 'next/navigation'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navigation = [
        { name: "Home", href: "/"},
        { name: "Rooms & Suites", href: "/rooms"},
        { name: "Facilities", href: "/facilities"},
        { name: "Dining", href: "/dining"},
        { name: "Events", href: "/events"},
        { name: "Gallery", href: "/gallery"},
        { name: "Contact", href: "/contact"},
        { name: "Offers", href: "/offers"}
    ]


    const pathname = usePathname()

  return (
    <header className='bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50'>
        {/* Top Bar with Contact Information */}
        <div className='bg-primary text-primary-foreground py-2'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className='flex justify-between items-center text-sm'>
                    <div className="flex items-center gap-6">
                        <div className='flex items-center gap-2'>
                            <Phone className="h-4 w-4" />
                            <span>+2348095556005</span>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <span>Experience Luxury in the Heart of Abuja</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Navigation */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-4'>
                {/* Logo */}
                <Link href='/' className='flex items-center'>
                    <Image 
                        src={'/NICON_Luxury.png'}
                        alt="Logo"
                        width="100"
                        height='50'
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link 
                            key={item.name}
                            href={item.href}
                            className={ cn("text-foreground hover:text-primary transition-colors duration-200 font-medium", pathname === item.href && "border-b-2 border-slate-900 font-bold")}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="hidden lg:flex items-center gap-4 p-2.5 ">
                    <Button asChild>
                        <Link href='/booking'>Book Now</Link>
                    </Button>
                </div>

                {/* Mobile menu button */}
                <button className='lg:hidden p-2' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden py-4 border-t border-border">
                    <nav className="flex flex-col space-y-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                            
                            
                        ))}
                    </nav>
                </div>
                
            )}
        </div>

    </header>
  )
}

export default Navbar