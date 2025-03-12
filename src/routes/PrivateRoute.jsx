import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("token"); // Get the token from localStorage
  // console.log(authToken);

  return authToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
