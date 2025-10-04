import { Separator } from "./ui/separator";
import { Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "Security", "Updates"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Help Center", "API Docs", "Templates", "Guides"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl text-white mb-4">
                  LinkedIn Blog Scheduler
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-md">
                  The smartest way to grow your LinkedIn presence. Generate, schedule, and analyze your content with AI-powered tools.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <a href="/" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="/" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="/" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors duration-300">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-800" />
        
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 LinkedIn Blog Scheduler. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Status
            </a>
            <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Changelog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}