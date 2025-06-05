import { useContext, useEffect, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Languages,
  DollarSign,
  ListChecks,
  ArrowLeft,
  XCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import AppContext from "../contexts/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const InfoRow = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-600 mt-1">{value}</p>
    </div>
  </div>
);

const JobDetailsPage = () => {
  const token = localStorage.getItem("token");
  const { user } = useContext(AuthContext);
  const { apiurl, setOpen, setAlertType, setAlertMessage } = useContext(AppContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [isEligible, setIsEligible] = useState(false);
  const navigate = useNavigate();

  const getDetails = async () => {
    try {
      const response = await axios.get(`${apiurl}/jobs/getById/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = () => {
    if (!user || !job) return false;

    const userGradYear = parseInt(user.yearOfGraduation);
    const minGrad = parseInt(job.minYearOfGraduation);
    const maxGrad = parseInt(job.maxYearOfGraduation);
    if (userGradYear < minGrad || userGradYear > maxGrad) return false;

    const userExp = parseInt(user.yearsOfExperience);
    const requiredExp = parseInt(job.yearsOfExperience);
    if (userExp < requiredExp) return false;

    const hasSkills = job.skills.every((skill) =>
      user.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
    );
    if (!hasSkills) return false;

    const hasLanguages = job.languagesKnown?.every((lang) =>
      user.languages?.map((l) => l.toLowerCase()).includes(lang.toLowerCase())
    );
    if (!hasLanguages) return false;

    if (
      job.gender !== "any" &&
      user.gender.toLowerCase() !== job.gender.toLowerCase()
    ) {
      return false;
    }

    return true;
  };

  const handleEnroll = async () => {
    if (!isEligible) {
      alert("You are not eligible for this position");
      return;
    }
    try {
      const response = await axios.get(`${apiurl}/jobs/apply/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setAlertType("success");
        setAlertMessage("Enrolled successfully!");
        setOpen(true);
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.response?.data?.message || "Failed to enroll in job");
      setOpen(true);
    }
  };

  useEffect(() => {
    getDetails();
  }, [id]);

  useEffect(() => {
    if (job && user) {
      setIsEligible(checkEligibility());
    }
  }, [job, user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Job Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-lg w-fit">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {job.company}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {job.location.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Banner */}
          <div className="px-6 md:px-8 pt-4">
            <div
              className={`p-3 rounded-lg ${
                isEligible
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>You meet all eligibility criteria!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>You don't meet the eligibility criteria.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Position Details</h2>
                <InfoRow icon={Users} label="Gender Preference" value={job.gender} />
                <InfoRow icon={DollarSign} label="Salary Package" value={`₹${job.salary}`} />
                <InfoRow icon={GraduationCap} label="Education Requirements" value={job.degrees} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements & Skills
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ListChecks className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {job.requirements.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-blue-600 rounded-full text-sm border border-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow
                  icon={Languages}
                  label="Languages Required"
                  value={job.languagesKnown.join(", ")}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Graduation Year Range"
                  value={`${job.minYearOfGraduation} - ${job.maxYearOfGraduation}`}
                />
                <InfoRow
                  icon={Users}
                  label="Experience Required"
                  value={`${job.yearsOfExperience} years`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 md:p-8 bg-gray-50">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleEnroll}
                disabled={!isEligible}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  isEligible
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isEligible ? "Enroll Now" : "Not Eligible"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailsPage;
