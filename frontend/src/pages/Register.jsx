import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);

      localStorage.setItem("pendingEmail", formData.email);
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit">Send OTP</button>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
}