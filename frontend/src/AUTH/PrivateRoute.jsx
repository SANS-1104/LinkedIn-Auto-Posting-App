import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Navbar/AuthContext";


const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
