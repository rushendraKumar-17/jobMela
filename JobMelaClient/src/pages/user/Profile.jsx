
import { useContext } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  MapPin,
  Eye,
  Edit,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center">
            <User className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
            <p className="text-lg md:text-xl">
              {user.yearsOfExperience} years experience
            </p>
            <div className="flex justify-center md:justify-start">
              <Link
                to="/profile/edit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-sm md:text-base"
              >
                <Edit className="w-4 h-4 md:w-5 md:h-5" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {user.formSubmitted === false && (
          <div className="max-w-6xl mx-auto mt-6 p-4 bg-red-100 border border-red-500 rounded-lg text-red-800 font-semibold text-center text-sm md:text-base">
            ⚠️ Please submit the required{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScegg7-2reKmuWLun-fQfnh9DqVU9Ghu7jNVbR0cvQRdmeT4A/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-900"
            >
              Google Form
            </a>{' '}
            with your registered email to complete your profile.
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <InfoItem icon={<Mail />} label={user.email} />
              <InfoItem icon={<Phone />} label={user.phone || 'Not specified'} />
              <InfoItem icon={<MapPin />} label={user.address || 'No address provided'} />
              <InfoItem icon={<Briefcase />} label={user.gender || 'Not specified'} />
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <Tag key={index} text={skill} />
                ))
              ) : (
                <p className="text-gray-500">No skills added</p>
              )}
            </div>
          </div>

          {/* Education Card */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {user.degrees?.length > 0 ? (
                user.degrees.map((degree, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 mt-1 text-blue-600" />
                    <div>
                      <p className="text-gray-600">{degree}</p>
                      {user.yearOfGraduation && (
                        <p className="text-sm text-gray-500">
                          Graduated {user.yearOfGraduation}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No education information</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* CV Section */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              CV Link
            </h2>
            {user.CVUrl ? (
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
                <a
                  href={user.CVUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm md:text-base"
                >
                  View CV on Google Drive
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No CV link provided</p>
            )}
          </div>

          {/* Languages Known */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Languages Known
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.languages?.length > 0 ? (
                user.languages.map((lang, index) => (
                  <Tag key={index} text={lang} />
                ))
              ) : (
                <p className="text-gray-500">No languages added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoItem component
const InfoItem = ({ icon, label }) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <span className="text-gray-600 text-sm md:text-base">{label}</span>
  </div>
);

// Reusable Tag component
const Tag = ({ text }) => (
  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
    {text}
  </span>
);

export default Profile;
