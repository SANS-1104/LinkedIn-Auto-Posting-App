import { useState } from "react";
import {
  Home,
  Users,
  Megaphone,
  BarChart,
  Settings,
  Wallet,
  DollarSign,
  X,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function StudioSuperAdminSidebar({ onSelect, activeTab }) {
  const [isOpen, setIsOpen] = useState(false); // for mobile toggle
  const navigate = useNavigate();

  const menuItems = [
    { id: "user", label: "User Management", icon: <Home size={20} /> },
    { id: "plan", label: "Plan Management", icon: <Users size={20} /> },
  ];

  const handleClick = (id) => {
    onSelect(id); // update parent state
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden absolute max-lg:bg-transparent flex items-start justify-between bg-white text-black px-4 py-3">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white backdrop-blur-lg border-r text-gray-700 flex flex-col justify-start p-6 transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">Skeylet</span>
              <p className="text-xs text-gray-600 font-medium">Studio Admin Panel</p>
            </div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center justify-start text-left space-x-3 px-4 py-3 rounded-xl transition
    ${isActive
                    ? "bg-[linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.1))] text-blue-600 shadow "
                    : "text-gray-700 hover:text-blue-600 hover:bg-[linear-gradient(135deg,rgba(79,70,229,0.15),rgba(124,58,237,0.1))]"
                  }`}
              >
                {/* Left border indicator for active tab */}
                <div className={`h-full w-1 rounded-r-full ${isActive ? "bg-blue-600" : "bg-transparent"}`} />

                {/* Icon color change when active */}
                {React.cloneElement(item.icon, { color: isActive ? "#4F46E5" : "#374151" })}

                <span className="font-medium text-base">{item.label}</span>

                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full ml-auto ${isActive
                    ? "bg-blue-200 text-blue-800"
                    : "bg-blue-100 text-blue-800"
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>

            );
          })}
        </nav>
      </aside>
    </>
  );
}
