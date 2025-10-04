// pages/SuperAdmin/SuperAdminDashboard.jsx
import React,{ useState } from "react";
import StudioSuperAdminSampleContent from "./StudioSuperAdminSampleContent";
import StudioSuperAdminDashboardSidebar from "./StudioSuperAdminDashboardSidebar";
import "./superadmin.css"

export default function StudioSuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="flex h-screen overflow-hidden">
      <StudioSuperAdminDashboardSidebar onSelect={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto bg-blue-50 p-6">
        <StudioSuperAdminSampleContent active={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}
