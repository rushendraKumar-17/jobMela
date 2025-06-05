import React, { useState, useRef, useEffect, useContext } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  ShieldAlert,
  MailCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

function VerifyRegister() {
  const { apiurl } = useContext(AuthContext);
  const result = useSearchParams();
  const email = result[0].get("email");
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  const [resendTime, setResendTime] = useState(30);
  const inputRefs = useRef([]);

  // Resend OTP countdown
  useEffect(() => {
    let timer;
    if (resendTime > 0) {
      timer = setInterval(() => {
        setResendTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTime]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${apiurl}/user/verify-email`, {
        verificationCode: otp.join(""),
        email,
      });

      if (response.status === 200) {
        setIsVerified(true);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setIsVerified(false);
      console.error("Verification failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendTime(30);
    try {
      await axios.post(`${apiurl}/user/resend-verification`, { email });
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Illustration Section */}
      <div className="hidden lg:block w-1/2 bg-indigo-50">
        <div className="h-full flex items-center justify-center p-12">
          <img
            src="https://img.freepik.com/free-vector/otp-verification-concept-illustration_114360-7269.jpg"
            alt="OTP Verification"
            className="w-full max-w-xl object-contain"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-14 h-14 text-center text-3xl font-semibold border-2 border-gray-200 rounded-xl
                                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                                               hover:border-indigo-300 transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.some((digit) => digit === "")}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all
                                ${
                                  isSubmitting ||
                                  otp.some((digit) => digit === "")
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
            >
              {isSubmitting ? (
                <Loader className="animate-spin h-6 w-6 mx-auto" />
              ) : isVerified === true ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Verified! Redirecting...
                </div>
              ) : isVerified === false ? (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <XCircle className="h-6 w-6" />
                  Invalid Code
                </div>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            {resendTime > 0 ? (
              <p>Resend code in {resendTime} seconds</p>
            ) : (
              <button
                onClick={handleResend}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 w-full"
              >
                <ShieldAlert className="w-5 h-5" />
                Didn't receive code? Resend now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyRegister;
