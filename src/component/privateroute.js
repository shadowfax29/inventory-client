import React from "react";

import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
const user=JSON.parse(localStorage.getItem("detail"))
  
  if (!user) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoutes;
