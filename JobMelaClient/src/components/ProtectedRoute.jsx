import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, forUser }) => {
  const { user,loading } = useContext(AuthContext);
  if(!loading){
  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  // Allow access if forUser is a string or array of roles
  const allowedRoles = Array.isArray(forUser) ? forUser : [forUser];

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Role not allowed
  return <Navigate to="/" replace />;
}
};

export default ProtectedRoute;
