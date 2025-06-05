import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  FileText,
  MessageSquare,
  Eye,
  Download,
} from "lucide-react";
import axios from "axios";
import PDFViewer from "./PdfViewer";
import AppContext from "../../contexts/AppContext";
import { AuthContext } from "../../contexts/AuthContext";
const JobApplications = () => {
  const { apiurl } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [openCard, setOpenCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [comments, setComments] = useState({});
  const commentRefs = useRef({});

  function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${apiurl}/jobs/${id}/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setApplications(response.data);
      const commentsObj = {};
      response.data.forEach((app) => {
        commentsObj[app.id] = app.comments || [];
      });
      setComments(commentsObj);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      interviewed: "bg-yellow-100 text-yellow-800",
      "on hold": "bg-gray-100 text-gray-800",
      "moved to next round": "bg-purple-100 text-purple-800",
      rejected: "bg-red-100 text-red-800",
      selected: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const ref = commentRefs.current[expandedCard];
    if (ref) {
      ref.scrollTop = ref.scrollHeight;
    }
  }, [comments, expandedCard]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${apiurl}/jobs/${applicationId}/edit`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const addComment = async (applicationId, comment) => {
    if (!comment.trim()) return;
    try {
      const response = await axios.post(
        `${apiurl}/jobs/${applicationId}/comment`,
        { comment, sender: user.name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments((prev) => ({
        ...prev,
        [applicationId]: [
          ...(prev[applicationId] || []),
          response.data.newComment,
        ],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleExpand = (applicationId) => {
    setExpandedCard(expandedCard === applicationId ? null : applicationId);
  };

  const getApplicationData = async (applicantId, applicationId) => {
    try {
      toggleExpand(applicationId);
      const response = await axios.get(
        `${apiurl}/user/getById/${applicantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOpenCard(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching application data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link
            to={`/admin/jobs/${id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Job Details
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Job Applications
          </h1>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  getApplicationData(application.userId, application.id);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {expandedCard === application.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applied on{" "}
                        {
                          new Date(application.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <select
                      value={application.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(application.id, e.target.value);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(
                        application.status
                      )}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="on hold">On Hold</option>
                      <option value="moved to next round">
                        Moved to Next Round
                      </option>
                      <option value="rejected">Rejected</option>
                      <option value="selected">Selected</option>
                    </select>
                  </div>
                </div>
              </div>

              {expandedCard === application.id && (
                <div className="border-t border-gray-200">
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {openCard?.email}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {openCard?.phone}
                          </p>
                          <p>
                            <span className="font-medium">Experience:</span>{" "}
                            {openCard?.yearsOfExperience}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 text-sm">CV Preview</p>
                          {/* <p className="text-xs text-gray-500">
                            Click "View CV" to open full document
                          </p> */}
                          {openCard?.CVUrl && <PDFViewer fileUrl={openCard.CVUrl} />}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          Comments
                        </h4>
                      </div>

                      <div
                        className="space-y-3 mb-4 max-h-32 overflow-y-auto"
                        ref={(el) => {
                          if (el && expandedCard) {
                            commentRefs.current[expandedCard] = el;
                          }
                        }}
                      >
                        {(comments[application.id] || []).map((comment,index) => (
                          <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-3"
                          >
                            <p className="text-sm text-gray-800">
                              {comment.comment}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {comment.sender} -{" "}
                              {formatDateTime(
                                new Date(comment.time).toLocaleString()
                              )}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        <textarea
                          placeholder="Add a comment about this candidate..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                          rows="3"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              const comment = e.target.value.trim();
                              if (comment) {
                                addComment(application.id, comment);
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const textarea =
                              e.currentTarget.previousElementSibling;
                            const comment = textarea.value.trim();
                            if (comment) {
                              addComment(application.id, comment);
                              textarea.value = "";
                            }
                          }}
                          className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600">
              No candidates have applied for this job position.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
