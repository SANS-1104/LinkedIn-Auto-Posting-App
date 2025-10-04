// src/AUTH/DashboardAuthProtect.jsx
import { Navigate, useParams } from "react-router-dom";

const DashboardAuthProtect = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "brand" | "influencer" | "superadmin"
  const username = localStorage.getItem("username");
  const { userName } = useParams();

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // role mismatch
  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // username mismatch (for brand/influencer)
  if (
    (allowedRole === "brand" || allowedRole === "influencer") &&
    username &&
    userName &&
    username !== userName
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default DashboardAuthProtect;
