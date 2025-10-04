import { Button } from "../LANDING-PAGE/ui/button";
import { Badge } from "../LANDING-PAGE/ui/badge";
import { Switch } from "../LANDING-PAGE/ui/switch";
import {
  Plus,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader({ currentPage, onPageChange }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }
  const navigate = useNavigate();
  const moveToHome = () =>{
    navigate('/')
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Create" },
    { id: "posts", label: "Posts" },
    { id: "calendar", label: "Calendar" },
    { id: "analytics", label: "Analytics" }
  ]

  return (
    <header className="border-b border-white/20 bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/50 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                <button onClick= { () => moveToHome()}><span className="font-bold text-sm">LS</span></button>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3">
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                LinkedIn Scheduler
              </span>
              <div className="text-xs text-gray-500">Professional Edition</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(item.id)}
                className={`relative group transition-all duration-300 ${
                  currentPage === item.id
                    ? "text-blue-600 bg-blue-50/50 shadow-sm"
                    : "hover:text-blue-600 hover:bg-blue-50/30"
                }`}
              >
                <span>{item.label}</span>
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                    currentPage === item.id
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></div>
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation Indicator */}
          <div className="md:hidden">
            <Badge
              variant="outline"
              className="bg-white/50 border-gray-200/50 backdrop-blur-sm"
            >
              {navItems.find(item => item.id === currentPage)?.label ||
                "Dashboard"}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <div className="hidden sm:flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-gray-200/50 backdrop-blur-sm">
            <Sun className="h-4 w-4 text-amber-500" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4 text-indigo-500" />
          </div>

          {/* Create Post Button */}
          <Button
            onClick={() => onPageChange("create")}
            className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Post</span>
          </Button>

          {/* Notifications */}
          {/* <Button
            variant="outline"
            size="icon"
            className="relative bg-white/50 border-gray-200/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:scale-105"
          >
            <Bell className="h-8 w-8" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-sm">
              3
            </Badge>
          </Button> */}

          {/* Profile */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange("profile")}
            className={`bg-white/50 border-gray-200/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:scale-105 ${
              currentPage === "profile"
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            }`}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
