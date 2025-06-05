import React, { useState, useEffect, useContext } from "react";
import {
  PlusCircle,
  Briefcase,
  MapPin,
  Users,
  DollarSign,
  FileText,
} from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import handleExport from "./ExportToExcel";
import AppContext from "../../contexts/AppContext";


const AdminDashboard = () => {
  const { setOpen, setAlertType, setAlertMessage } = useContext(AppContext);
  const { user, apiurl } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: [],
    genderPreference: "Any",
    minYearOfGraduation: "",
    maxYearOfGraduation: "",
    yearsOfExperience: "",
    languagesKnown: [],
    skills: "",
    branch: "CSE",
    requirements: "",
    salary: "",
  });

  const navigate = useNavigate();

  const handleAddJob = async (e) => {
    e.preventDefault();
    const requirements = formData.requirements.replace(" ", "").split(",");
    const skills = formData.skills.replace(" ", "").split(",");
    const payload = {
      ...formData,
      requirements,
      skills,
      company: user.company,
    };

    try {
      const response = await axios.post(
        `${apiurl}/jobs/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newJob = {
        id: response.data.newJob.id,
        ...formData,
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
      };

      setJobs([...jobs, newJob]);
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding job", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: [],
      genderPreference: "Any",
      minYearOfGraduation: "",
      maxYearOfGraduation: "",
      yearsOfExperience: "",
      languagesKnown: [],
      skills: "",
      branch: "CSE",
      requirements: "",
      salary: "",
    });
  };

  const getCompanyJobs = async () => {
    if (!user) return;
    try {
      const company = user.company.toLowerCase().replace(" ", "");
      const response = await axios.get(
        `${apiurl}/jobs/getByCompany/${company}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching company jobs", error);
    }
  };

  useEffect(() => {
    getCompanyJobs();
  }, [user]);

  // const handleGenerateReport = async() => {
  //   try {
  //     const response =await axios.get(`${apiurl}/admin/report`,{headers:
  //       { Authorization: `Bearer ${localStorage.getItem("token")}` }
  //     } );
  //     console.log(response);
  //     handleExport(response.data.jobs,"report.xlsx");
      
       
  //   } catch (error) {
  //     console.error("Error generating report", error);
      
  //   }
    
  // };
  const handleGenerateReport = async () => {
  try {
    const response = await axios.get(`${apiurl}/admin/report`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    // Process applications data
    const applications = response.data.applications;
    const jobs = response.data.jobs;

    // Group applications by status using reduce (from search results)
    const groupedByStatus = applications.reduce((acc, app) => {
      acc[app.status] = acc[app.status] || [];
      acc[app.status].push(app);
      return acc;
    }, {});

    // Calculate statistics
    const reportData = {
      totalApplications: applications.length,
      statusCounts: {
        applied: groupedByStatus.applied?.length || 0,
        selected: groupedByStatus.selected?.length || 0,
        interviewed: groupedByStatus.interviewed?.length || 0,
        rejected: groupedByStatus.rejected?.length || 0
      },
      selectedCandidates: {
        count: groupedByStatus.selected?.length || 0,
        ids: groupedByStatus.selected?.map(app => app.userId) || []
      },
      applicationsPerJob: jobs.reduce((acc, job) => {
        acc[job.id] = applications.filter(app => app.jobId === job.id).length;
        return acc;
      }, {})
    };

    // Format data for Excel export
    const excelData = [
      ["Metric", "Count", "Details"],
      ["Total Applications", reportData.totalApplications],
      ["Applied", reportData.statusCounts.applied],
      ["Selected", reportData.statusCounts.selected, 
       `IDs: ${reportData.selectedCandidates.ids.join(", ") || "None"}`],
      ["Interviewed", reportData.statusCounts.interviewed],
      ["Rejected", reportData.statusCounts.rejected],
      ["", "", ""], // Empty row for spacing
      ["Job ID", "Job Title", "Applications Received"]
    ];

    // Add job application counts
    jobs.forEach(job => {
      excelData.push([
        job.id,
        job.title,
        reportData.applicationsPerJob[job.id] || 0
      ]);
    });

    handleExport(excelData, "job_report.xlsx");

  } catch (error) {
    console.error("Error generating report", error);
    setOpen(true);
    setAlertType("error");
    setAlertMessage("Failed to generate report");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base transition-all w-full sm:w-auto"
            >
              <PlusCircle className="w-5 h-5" />
              {showAddForm ? "Close Form" : "Add New Job"}
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base transition-all w-full sm:w-auto"
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Add Job Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddJob}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormInput
                label="Job Title *"
                value={formData.title}
                onChange={(val) => setFormData({ ...formData, title: val })}
                required
              />
              <FormTextArea
                label="Job Description *"
                value={formData.description}
                onChange={(val) =>
                  setFormData({ ...formData, description: val })
                }
                rows={4}
              />
              <FormInput
                label="Location (comma separated) *"
                value={formData.location.join(", ")}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    location: val.split(",").map((loc) => loc.trim()),
                  })
                }
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender Preference
                </label>
                <div className="flex gap-4 mt-2">
                  {["Male", "Female", "Any"].map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-1 text-sm"
                    >
                      <input
                        type="radio"
                        name="genderPreference"
                        value={gender}
                        checked={formData.genderPreference === gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            genderPreference: e.target.value,
                          })
                        }
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>
              <FormInput
                label="Min Year of Graduation"
                value={formData.minYearOfGraduation}
                onChange={(val) =>
                  setFormData({ ...formData, minYearOfGraduation: val })
                }
              />
              <FormInput
                label="Max Year of Graduation"
                value={formData.maxYearOfGraduation}
                onChange={(val) =>
                  setFormData({ ...formData, maxYearOfGraduation: val })
                }
              />
              <FormInput
                label="Years of Experience"
                value={formData.yearsOfExperience}
                onChange={(val) =>
                  setFormData({ ...formData, yearsOfExperience: val })
                }
              />
              <FormInput
                label="Salary"
                value={formData.salary}
                onChange={(val) => setFormData({ ...formData, salary: val })}
              />
              <FormInput
                label="Languages Known (comma separated)"
                value={formData.languagesKnown.join(", ")}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    languagesKnown: val.split(",").map((v) => v.trim()),
                  })
                }
              />
              <FormInput
                label="Skills (comma separated)"
                value={formData.skills}
                onChange={(val) => setFormData({ ...formData, skills: val })}
              />
              <FormInput
                label="Requirements (comma separated)"
                value={formData.requirements}
                onChange={(val) =>
                  setFormData({ ...formData, requirements: val })
                }
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {[
                    "CSE", "IT", "ECE", "EEE", "ME", "CE", "AE", "BT", "CH",
                    "IE", "MT", "PE", "ENV", "MIN", "AR", "IS", "DS", "AI",
                    "ROBO", "AUT", "INST", "OTHERS",
                  ].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Add Job
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Job Listings */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold">
              Active Job Listings
            </h2>
          </div>
          <div className="p-4  overflow-y-auto space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group p-4 border rounded-md hover:bg-blue-50 transition cursor-pointer"
                onClick={() => navigate(`/admin/jobs/${job.id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {job.applicationCount || 0} Applications
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    ₹{job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    {job.location.join(", ")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    {job.yearsOfExperience}+ yrs
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    {job.branch}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Form Input Component
const FormInput = ({ label, value, onChange, required }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
      required={required}
    />
  </div>
);

// Reusable TextArea Component
const FormTextArea = ({ label, value, onChange, rows }) => (
  <div className="space-y-1 md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
      rows={rows}
    />
  </div>
);

export default AdminDashboard;
