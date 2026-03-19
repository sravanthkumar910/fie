import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, { email, otp });

      alert("Verified! You can now login.");
      localStorage.removeItem("pendingEmail");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="auth-card">
      <h2>Verify OTP</h2>
      <p>Sent to: {email}</p>
      <form onSubmit={handleVerify}>
        <input type="text" placeholder="6-digit OTP" maxLength="6" onChange={(e) => setOtp(e.target.value)} />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}