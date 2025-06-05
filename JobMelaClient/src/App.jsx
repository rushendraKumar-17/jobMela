import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import './leafletFix'; // path to the fix file

import VerifyRegister from "./pages/auth/VerifyRegister";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import Enrolled from "./pages/user/Enrolled";
import Footer from "./components/Footer";
import { useContext } from "react";
import AppContext from "./contexts/AppContext";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import JobDetailsModal from "./pages/JobDetailsModal";
import Profile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobPage from "./pages/admin/JobPage";
import EditJobPage from "./pages/admin/EditJobPage";
import JobApplications from "./pages/admin/JobApplications";
import SuperAdminPage from "./pages/superAdmin/SuperAdmin";
import EditProfile from "./pages/user/EditProfile";
import ChooseHome from "./components/ChooseHome";
import { AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import JobDetails from "./pages/user/JobDetails";

const App = () => {
  const { open, alertType, alertMessage, handleClose } = useContext(AppContext);
  
  return (
    // Flex container that fills the screen
   <div className="min-h-screen flex flex-col">
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertType} // e.g. 'success' | 'error' | 'info' | 'warning'
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          }
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Navbar />

      {/* Main content area that expands to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ChooseHome><Home /></ChooseHome> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<ProtectedRoute forUser="user"><Jobs /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute forUser="user"><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute forUser="user"><EditProfile /></ProtectedRoute>} />
          <Route path="/job/:id" element={<><JobDetailsModal /></>} />
          <Route path="/enrolledjob/:id" element={<ProtectedRoute forUser="user"><JobDetails /></ProtectedRoute>} />
          <Route path="/enrolled" element={<><Enrolled /></>} />
          <Route path="/verify-register" element={<VerifyRegister />} />

          <Route path="/admin" element={<ProtectedRoute forUser="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin" element={<ProtectedRoute forUser="super-admin"><SuperAdminPage /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id" element={<ProtectedRoute forUser="admin"><JobPage /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id/edit" element={<ProtectedRoute forUser="admin"><EditJobPage /></ProtectedRoute>} />
          <Route
            path="/admin/jobs/:id/applications"
            element={<ProtectedRoute forUser="admin"><JobApplications /></ProtectedRoute>}
          />
          <Route path="*" element={<Home /> } />
        </Routes>
      </main>

      <Footer />
    </div>
    
    

    
  );
};

export default App;
