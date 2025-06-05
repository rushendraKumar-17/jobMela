import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import SuperAdminPage from '../pages/superAdmin/SuperAdmin';
import Home from '../pages/Home';
import Login from "../pages/auth/Login"
const ChooseHome = () => {
  const { user } = useContext(AuthContext);
  // console.log(user)
  if (!user) {
    // User not logged in — show default Home
    return <Login />;
  }

  // User is logged in — render based on role
  switch (user.role) {
    case 'user':
      return <Home />;
    case 'admin':
      return <AdminDashboard />;
    case 'super-admin':
      return <SuperAdminPage />;
    default:
      return <div>Unauthorized Role</div>;
  }
};

export default ChooseHome;
