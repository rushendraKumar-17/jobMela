import { useContext, useEffect, useState } from "react";
import { PlusCircle, Trash2, ShieldHalf, Eye, EyeOff } from "lucide-react";
import AppContext from "../../contexts/AppContext";
import axios from "axios";

const SuperAdminPage = () => {
  const { apiurl } = useContext(AppContext);
  const [adminForm, setAdminForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "admin",
  });

  const getAdmins = async () => {
    try {
      const res = await axios.get(`${apiurl}/admin/getAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (
      newAdmin.name &&
      newAdmin.email &&
      newAdmin.password &&
      newAdmin.company
    ) {
      try {
        const res = await axios.post(`${apiurl}/admin/add`, newAdmin, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAdmins([...admins, { ...newAdmin, id: res.data.admin.id }]);
        setAdminForm(false);
      } catch (err) {
        console.error("Error adding admin:", err);
      } finally {
        setNewAdmin({
          name: "",
          email: "",
          password: "",
          company: "",
          role: "admin",
        });
      }
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`${apiurl}/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAdmins(admins.filter((admin) => admin.id !== id));
    } catch (err) {
      console.error("Error deleting admin:", err);
    }
  };

//   const handleRoleChange = async (id, newRole) => {
//     try {
//       await axios.put(
//         `${apiurl}/admin/changeRole/${id}`,
//         { role: newRole },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setAdmins(
//         admins.map((admin) =>
//           admin.id === id ? { ...admin, role: newRole } : admin
//         )
//       );
//     } catch (err) {
//       console.error("Error updating role:", err);
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldHalf className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            Super Admin Management
          </h1>
          
          <button
            onClick={() => setAdminForm(!adminForm)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <PlusCircle className="w-5 h-5" />
            {adminForm ? "Close Form" : "Add New Admin"}
          </button>
        </div>

        {/* Form */}
        {adminForm && (
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="text-green-600 w-5 h-5" />
              Add New Admin
            </h2>
            <form
              onSubmit={handleAddAdmin}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="p-2 border rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="p-2 border rounded-md"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  className="p-2 border rounded-md w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <input
                type="text"
                placeholder="Company"
                value={newAdmin.company}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, company: e.target.value })
                }
                className="p-2 border rounded-md"
                required
              />
              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
                className="p-2 border rounded-md"
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
              >
                Add Admin
              </button>
            </form>
          </div>
        )}

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-700">
                  Company
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{admin.name}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.company}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full text-xs font-medium px-3 py-1 ${
                        admin.role === "super-admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {admin.role
                        .replace("-", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </td>

                  {/* <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td> */}
                  <td className="px-4 py-3 text-right">
                    {admin.role !== "super-admin" && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {admins.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No administrators found. Start by adding a new admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
