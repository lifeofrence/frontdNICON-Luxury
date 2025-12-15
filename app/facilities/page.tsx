import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "lucide-react"
import { Dumbbell, Waves, Sparkles } from "lucide-react" // pick appropriate names
import { tennisBall, bathBubble, tennisRacket} from "@lucide/lab"

export default function FacilitiesPage() {
  const facilities = [
    {
      icon: <Dumbbell />,
      title: "Gymnasium & Steam Room",
      description:
        "Stay in shape with our luxury ultramodern gym featuring cardiovascular and weight-training equipment and personal TV screens. After your workout, relax and enjoy the steam room — great for recovery, stress relief, and overall wellbeing.",
      image: "/gymOne.jpg",
    },
    {
      icon: <Icon iconNode={tennisBall}/>,
      title: "Lawn Tennis Court",
      description:
        "Flood-lit tennis courts available day and night for recreation and competitive play, providing an exhilarating experience whenever you choose to play.",
      image: "/tennisCourtOne.jpg",
    },
    {
      icon: <Waves/>,
      title: "Swimming Pool",
      description:
        "Ultra-modern, recently renovated pool designed to refresh and unwind. The pool area is also ideal for events — birthdays, parties, cocktails, or fashion shows.",
      image: "/poolOne.jpg",
    },
    {
      icon: <Icon iconNode={bathBubble}/>,
      title: "Sauna",
      description:
        "Modern sauna with proven health benefits: tension reduction, muscle relaxation, improved alertness and a revived, relaxed feeling after each session.",
      image: "/toiletOne.jpg",
    },
    {
      icon: <Icon iconNode={tennisRacket}/>,
      title: "Squash Court",
      description:
        "Well-built squash court perfect for high-intensity play. Excellent for improving cardiovascular fitness and endurance — a fast-paced workout that burns significant energy.",
      image: "/tennisCourtOne.jpg",
    },
    {
      icon: <Sparkles/>,
      title: "Massage & Spa Treatments",
      description:
        "Professional massage therapy to help you relax and recover. Beyond relaxation, massage offers many health benefits — book an appointment to feel the difference.",
      image: "/spaOne.jpg",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <Image
          src="/yardTwo.jpg"
          alt="Nicon Luxury Hotel Facilities"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance">
            World-Class Recreational Facilities
          </h1>
          <p className="text-xl md:text-2xl text-white/90 text-balance">
            Experience exceptional relaxation with our ultra-modern health and fitness amenities designed for your comfort and convenience
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => {
            const Icon = facility.icon
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {Icon}
                    </div>
                    <h3 className="font-heading text-2xl font-bold">{facility.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-6 text-balance">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-balance">
            Book your stay today and enjoy access to all our premium facilities
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/booking">Book Your Stay</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
