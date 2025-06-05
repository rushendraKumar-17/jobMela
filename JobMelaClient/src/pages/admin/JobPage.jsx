
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Users,
  GraduationCap,
  DollarSign,
  ListChecks,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import AppContext from "../../contexts/AppContext";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1 break-words">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-600 mt-1">{value || "Not specified"}</p>
    </div>
  </div>
);

const JobDetailsPage = () => {
  const { setOpen, setAlertMessage, setAlertType } = useContext(AppContext);
  const { apiurl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobData = await axios.get(`${apiurl}/jobs/getById/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJob(jobData.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${apiurl}/jobs/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOpen(true);
        setAlertType("success");
        setAlertMessage("Job deleted successfully");
        navigate("/admin");
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Job not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Jobs
          </Link>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              to={`/admin/jobs/${id}/edit`}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              Edit Job
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Delete Job
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Job Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-4 w-full">
                <div className="bg-blue-600 p-3 sm:p-4 rounded-xl flex-shrink-0">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                    {job.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
                    {job.company}
                  </p>
                </div>
              </div>

              <Link
                to={`/admin/jobs/${id}/applications`}
                className="self-end sm:self-auto"
              >
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-sm sm:text-base md:text-lg rounded-full hover:bg-green-200 transition-colors whitespace-nowrap">
                  {job.applicationCount} Applications
                </span>
              </Link>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8">
            {/* Left Column */}
            <div className="space-y-4 sm:space-y-6">
              <InfoRow
                icon={MapPin}
                label="Location"
                value={job.location?.join(", ")}
              />
              <InfoRow
                icon={DollarSign}
                label="Salary"
                value={job.salary ? `₹${job.salary}` : "Not specified"}
              />
              <InfoRow
                icon={Users}
                label="Experience Required"
                value={
                  job.yearsOfExperience
                    ? `${job.yearsOfExperience} years`
                    : "Not specified"
                }
              />
              <InfoRow
                icon={GraduationCap}
                label="Education"
                value={job.degrees || "Not specified"}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Requirements
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {job.requirements?.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ListChecks className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 break-words">{req}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-white text-blue-600 rounded-full text-xs sm:text-sm border border-blue-200 break-words"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
