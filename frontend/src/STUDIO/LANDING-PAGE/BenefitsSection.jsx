import { CheckCircle, Clock, TrendingUp, Target, Users } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Save hours every week",
      description: "Automate your content creation and posting workflow"
    },
    {
      icon: TrendingUp,
      title: "Get more engagement",
      description: "AI-optimized content that resonates with your audience"
    },
    {
      icon: Target,
      title: "Never miss a trending topic",
      description: "Stay relevant with AI-powered content suggestions"
    },
    {
      icon: Users,
      title: "Built for creators, founders, job seekers",
      description: "Tailored features for different professional needs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            Why LinkedIn Blog Scheduler Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your LinkedIn presence with proven results
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}