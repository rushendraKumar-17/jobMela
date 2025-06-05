import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  LogOut,
  User,
  Menu,
  X,
  Search,
  Briefcase,
  Home,
  UserPlus,
  UserCheck,
  UserCheck2,
} from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };
  // console.log(user)
 

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50 ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src="/logo.jpeg"
              alt="JobMela Logo"
              className="h-10 w-10 mr-3 rounded-full bg-white "
            />
            <span className="text-2xl font-bold text-white hidden md:block">
              Job<span className="text-yellow-300">Mela</span>
            </span>
          </Link>

         

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 ml-auto items-center">
            {(!user ||
              (user.role !== "admin" && user.role !== "super-admin")) && (
              <>
                <div className="flex gap-8">
                  <Link
                    to="/jobs"
                    className="flex items-center text-white/90 hover:text-white transition-colors group"
                  >
                    <Briefcase
                      className="mr-2 group-hover:text-yellow-300"
                      size={18}
                    />
                    Jobs
                  </Link>
                  {user && (
                    <Link
                      to="/enrolled"
                      className="flex items-center text-white/90 hover:text-white transition-colors group"
                    >
                      <UserCheck2
                        className="mr-2 group-hover:text-yellow-300"
                        size={18}
                      />
                      Enrolled
                    </Link>
                  )}
                </div>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4 ml-4">
                
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 focus:outline-none relative group"
                >
                  <div
                    className={`w-10 h-10 rounded-full text-white font-bold text-xl bg-white/20 flex items-center justify-center
      ${user.formSubmitted === false ? "ring-2 ring-red-500" : ""}
    `}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user.name}</span>

                  {/* Tooltip */}
                  {user.formSubmitted === false && (
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      Submit the form
                    </span>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4 ml-4">
                <Link
                  to="/login"
                  className="px-5 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4 bg-white">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-gray-700 hover:bg-blue-50 rounded-lg px-3"
          >
            <Home className="inline-block mr-2" size={18} />
            Home
          </Link>

          {(!user || (user.role !== "admin" && user.role !== "super-admin")) &&
            user && (
              <>
                <Link
                  to="/jobs"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 hover:bg-blue-50 rounded-lg px-3"
                >
                  <Briefcase className="inline-block mr-2" size={18} />
                  Jobs
                </Link>
                <Link
                  to="/enrolled"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-gray-700 hover:bg-blue-50 rounded-lg px-3"
                >
                  <UserPlus className="inline-block mr-2" size={18} />
                  Enrolled
                </Link>
              </>
            )}
          {user ? (
            <>
              {(!user ||
                (user.role !== "admin" && user.role !== "super-admin")) && (
               
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 rounded-lg px-3 relative group ${
                    user.formSubmitted === false
                      ? "text-red-600 ring-1 ring-red-600"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <User className="inline-block mr-2" size={18} />
                  Profile
                  {/* Tooltip */}
                  {user.formSubmitted === false && (
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-red-600 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      Submit the form
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="inline-block mr-2" size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
