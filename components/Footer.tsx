import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="font-heading text-2xl font-bold mb-4">
              NICON
              <span className="text-accent ml-1">LUXURY</span>
            </div>
            <p className="text-primary-foreground/80 mb-4 leading-relaxed">
              Experience unparalleled luxury and comfort in the heart of Abuja. Your premier destination for business
              and leisure.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/g/1KNXpCq8gW/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/niconluxury?igsh=eWd5N29xcXdlOGFo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://x.com/niconluxury?s=11&t=jpmGjUk_0nmOQq4o76lTJQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Twitter/X page"
              >
                <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/nicon-luxury-abuja/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Facilities
                </Link>
              </li>
              <li>
                <Link href="/dining" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Dining
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-primary-foreground/80">24/7 Room Service</span>
              </li>
              <li>
                <span className="text-primary-foreground/80">Concierge Service</span>
              </li>
              <li>
                <span className="text-primary-foreground/80">Airport Transfer</span>
              </li>
              <li>
                <span className="text-primary-foreground/80">Business Center</span>
              </li>
              <li>
                <span className="text-primary-foreground/80">Spa & Wellness</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Plot 903, Tafawa Balewa Way, Central Business District, Abuja, Nigeria
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span className="text-primary-foreground/80">+2348095556005</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span className="text-primary-foreground/80">info@niconluxury.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">© 2025 Nicon Luxury Hotel Abuja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
