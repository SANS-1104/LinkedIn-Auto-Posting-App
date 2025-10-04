import React, { useState } from "react";
import UserManagement from "./UserManagement/UserManagement";
import PlanManagement from "./PlanManagement/PlanManagement";


export default function StudioSuperAdminSampleContent({ active, onTabChange }) {
  const renderPage = () => {
    switch (active) {
      case "user":
        return <UserManagement onTabChange={onTabChange} />;
      case "plan":
        return <PlanManagement />;
      default:
        return <UserManagement onTabChange={onTabChange} />;
    }
  };

  return (
    <div className="relative h-full">
      {renderPage()}
    </div>
  );
}
