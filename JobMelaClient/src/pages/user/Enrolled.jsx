import axios from "axios";
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";
import { useContext, useEffect } from "react";
import AppContext from "../../contexts/AppContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EnrolledJobs = () => {
  const navigate = useNavigate();
  const { apiurl, setEnrolledJobs, enrolledJobs } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Interview Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-purple-100 text-purple-800";
      case "Offered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrolledJobs = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `${apiurl}/user/getEnrolledJobs/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEnrolledJobs([]); // Reset before repopulating
      response.data.map(async (application) => {
        const job = await axios.get(
          `${apiurl}/jobs/getById/${application.jobId}`
        );
        setEnrolledJobs((prev) => [
          ...prev,
          {
            ...job.data,
            status: application.status,
            appliedDate: application.createdAt,
          },
        ]);
      });
    } catch (error) {
      console.error("Error fetching enrolled jobs:", error);
    }
  };

  useEffect(() => {
    getEnrolledJobs();
  }, [user]);
  console.log(enrolledJobs);
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-6 sm:py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Your Enrolled Applications
          </h1>
          <div className="flex items-center gap-3 text-gray-200 text-sm sm:text-base">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{enrolledJobs.length} Active Applications</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {enrolledJobs.length}
              </p>
              <p className="text-sm text-gray-600">Total Applied</p>
            </div>
            {/* <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">In Process</p>
            </div> */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {
                  enrolledJobs.filter(
                    (job) =>
                      !["interviewed", "selected", "rejected"].includes(
                        job.status?.toLowerCase()
                      )
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">In Process</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {
                  enrolledJobs.filter((job) => job.status === "interviewed")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600">Interviews</p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledJobs &&
            enrolledJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/enrolledjob/${job.id}`)}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>
                        {Array.isArray(job.location)
                          ? job.location.join(", ")
                          : job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>
                        Applied {new Date(job.appliedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledJobs;
