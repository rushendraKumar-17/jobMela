import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.company) return <AdminDashboard/>;
  if (!user.company) return <>{children}</> // Redirect non-admin users
  return children;
};

export default AdminRoute;