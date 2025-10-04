import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, Palette, Rocket, Megaphone } from "lucide-react";

export function UseCasesSection() {
  const useCases = [
    {
      icon: Search,
      avatar: "JS",
      title: "Job Seekers",
      description: "Build your personal brand and attract recruiters with consistent, professional content that showcases your expertise."
    },
    {
      icon: Palette,
      avatar: "FC",
      title: "Freelancers & Creators",
      description: "Grow your audience, establish thought leadership, and attract high-value clients with engaging LinkedIn content."
    },
    {
      icon: Rocket,
      avatar: "FO",
      title: "Founders",
      description: "Share your startup journey, connect with investors, and build a community around your brand and vision."
    },
    {
      icon: Megaphone,
      avatar: "MA",
      title: "Marketers & Agencies",
      description: "Manage multiple client accounts, maintain consistent posting schedules, and deliver proven results at scale."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            Perfect for Every Professional
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're job hunting, building a business, or growing your influence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Avatar className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600">
                    <AvatarFallback className="text-white text-lg w-full text-center">
                      {useCase.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <useCase.icon className="w-6 h-6 text-blue-600" />
                </div>
                
                <h3 className="text-xl mb-3 text-gray-900">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}