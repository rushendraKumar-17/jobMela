// src/components/JobCard.jsx

import { MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate= useNavigate();

  return (
    <div
      // onClick={() => onClick(job)}
      onClick={() => navigate(`/job/${job.id}`) }
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-700 font-medium mt-1">{job.company}</p>
          </div>
          {job.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Exp: {job.yearsOfExperience} years
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>{job.location.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-gray-500" />

            <span className="font-medium text-green-700">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span>{moment(job.createdAt).fromNow()}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Posted {moment(job.createdAt).format('MMM D')}</span>
          
        </div>
      </div>
    </div>
  );
};

export default JobCard;
