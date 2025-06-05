import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Briefcase, ArrowLeft, Save } from "lucide-react";
import AppContext from "../../contexts/AppContext";

const EditJobPage = () => {
  const { setOpen, setAlertType, setAlertMessage } = useContext(AppContext);
  const { apiurl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: [],
    salary: "",
    yearsOfExperience: "",
    degrees: "",
    requirements: [],
    skills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${apiurl}/jobs/getById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const jobData = response.data;
        setFormData({
          ...jobData,
          location: jobData.location.join(", "),
          requirements: jobData.requirements.join(", "),
          skills: jobData.skills.join(", "),
        });
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      const requirements = formData.requirements.replace(" ", "").split(",");
      const skills = formData.skills.replace(" ", "").split(",");
      const location = formData.location.replace(" ", "").split(",");
      const payload = {
        ...formData,
        requirements,
        skills,
        location,
      };

      await axios.put(`${apiurl}/jobs/edit/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log(response);
      navigate(`/admin/jobs/${id}`);
      setAlertType("success");
      setAlertMessage("Job updated successfully!");
      setOpen(true);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

 // no changes to imports or state setup...

return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Job
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="bg-blue-600 p-4 rounded-xl self-start">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-2xl sm:text-3xl font-bold bg-white border rounded-lg p-2 w-full"
              />
              <p className="text-sm sm:text-base">{formData.company}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Left */}
          <div className="space-y-6">
            {[
              { label: "Location (comma separated)", name: "location" },
              { label: "Salary", name: "salary" },
              { label: "Experience Required", name: "yearsOfExperience" },
              { label: "Education", name: "degrees" },
            ].map(({ label, name }) => (
              <div key={name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Requirements (comma separated)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg h-32 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default EditJobPage;
