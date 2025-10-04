import { Card, CardContent } from "./ui/card";
import { Bot, Calendar, Send, BarChart3 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI Blog Generator",
      description: "Write professional posts in seconds"
    },
    {
      icon: Calendar,
      title: "Post Scheduler",
      description: "Plan weeks of content in advance"
    },
    {
      icon: Send,
      title: "LinkedIn Auto-Posting",
      description: "Let us handle the posting"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Measure what performs best"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            Everything you need to dominate LinkedIn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From content creation to performance tracking, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}