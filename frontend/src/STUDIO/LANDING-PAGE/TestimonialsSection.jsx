import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "LinkedIn Blog Scheduler helped me grow my follower count by 300% in just 2 months. The AI-generated content is surprisingly good and saves me hours every week.",
      name: "Sarah Chen",
      title: "Marketing Director",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "As a busy founder, I needed something that could handle my LinkedIn presence automatically. This tool is exactly what I was looking for - set it and forget it.",
      name: "Michael Rodriguez",
      title: "Tech Founder",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "The analytics dashboard is incredible. I can finally see what content performs best and optimize my strategy accordingly. Game changer for my consulting business.",
      name: "Emily Thompson",
      title: "Business Consultant",
      avatar: "ET",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            Loved by professionals worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands who've transformed their LinkedIn presence
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 bg-gradient-to-br  from-blue-500 to-indigo-600 mr-4">
                    <AvatarFallback className="text-white w-full text-center">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-gray-900 mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}