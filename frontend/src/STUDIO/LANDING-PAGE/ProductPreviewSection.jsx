import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, Edit3, BarChart, Palette } from "lucide-react";

export function ProductPreviewSection() {
  const features = [
    {
      icon: Calendar,
      title: "Calendar View",
      description: "Plan your content schedule at a glance",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      icon: Edit3,
      title: "Post Editor",
      description: "Craft perfect LinkedIn posts with AI assistance",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80"
    },
    {
      icon: BarChart,
      title: "Analytics Graph",
      description: "Track performance and optimize your strategy",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            See LinkedIn Blog Scheduler in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Clean, intuitive interface designed for productivity
          </p>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Palette className="w-4 h-4 mr-2" />
              Dark Mode Available
            </Badge>
            <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500">
              Virality Score: 8.5/10
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-xl">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}