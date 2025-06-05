import { useContext, useEffect, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Languages,
  DollarSign,
  ListChecks,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../contexts/AppContext";


// eslint-disable-next-line
const InfoRow = ({ icon: Icon, label, value, className }) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-600 mt-1">{value}</p>
    </div>
  </div>
);

const JobDetails = () => {
  const { apiurl } = useContext(AppContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const navigate = useNavigate();

  const getDetails = async () => {
    try {
      const response = await axios.get(`${apiurl}/jobs/getById/${id}`);
      setJob(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();

    // eslint-disable-next-line
  }, [job]);

  if (loading) {
    return <>Loading ... </>;
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
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>
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

          {/* Job Details */}
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Position Details
                </h2>
                <InfoRow
                  icon={Users}
                  label="Gender Preference"
                  value={job.gender}
                />
                <InfoRow
                  icon={DollarSign}
                  label="Salary Package"
                  value={`₹${job.salary}`}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Education Requirements"
                  value={job.degrees}
                />
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
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
