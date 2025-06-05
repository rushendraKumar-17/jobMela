// // src/pages/Jobs.jsx
// import React, { useContext, useEffect } from "react";
// import JobCard from "../components/JobCard";

// import { Filter } from "lucide-react";
// import AppContext from "../contexts/AppContext";
// import axios from "axios";

// const Jobs = () => {
//   const { cardData, setCardData, apiurl } = useContext(AppContext);
//   const getCardData = async () => {
//     try {
//       const response = await axios.get(`${apiurl}/jobs/getAll`);
//       setCardData(response.data);
//     } catch (error) {
//       console.error("Error fetching card data:", error);
//     }
//   };

//   useEffect(() => {
//     getCardData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {cardData.length} Job Listings
//           </h2>
          
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {cardData.map((job) => (
//             <JobCard key={job.id} jobId={job.id} job={job} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Jobs;
// src/pages/Jobs.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, User, MapPin } from "lucide-react";
import AppContext from "../contexts/AppContext";
import axios from "axios";

const Jobs = () => {
  const { cardData, setCardData, apiurl } = useContext(AppContext);
  const navigate = useNavigate();

  const getCardData = async () => {
    try {
      const response = await axios.get(`${apiurl}/jobs/getAll`);
      setCardData(response.data);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  useEffect(() => {
    getCardData();
  }, []);

  // Function to calculate time since posting
  const timeSince = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate - postedDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
    return postedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Next Opportunity
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {cardData.length} Open Positions
            </span>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {cardData.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/job/${job.id}`)}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 cursor-pointer border border-gray-100 hover:border-blue-100"
              role="button"
              tabIndex={0}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left Content */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{job.location.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{timeSince(job.postedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800">
                    {job.yearsOfExperience}+ years experience
                  </div>
                  {job.jobType && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {job.jobType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
