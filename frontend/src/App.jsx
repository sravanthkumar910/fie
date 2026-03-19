
import { useEffect, useRef, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";

import BrandProfile from "./components/brandProfile";
import Dashboard from "./components/dashboard";
import DiscoverCreators from "./components/discoverCreators";
import HelpCenter from "./components/helpCenter";
import Messages from "./components/messages";
import Payments from "./components/payments";
import Performance from "./components/performance";
import Projects from "./components/projects";
import Settings from "./components/settings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

/* ---------------- PROTECTED ROUTE ---------------- */

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("userInfo");
  return user ? children : <Navigate to="/" />;
};

/* ---------------- SIDEBAR ITEM ---------------- */

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    className={`sb-item ${active ? "active" : ""}`}
    onClick={onClick}
    style={{ cursor: "pointer", padding: "10px 20px" }}
  >
    <span style={{ marginRight: "10px" }}>{icon}</span>
    {label}
  </div>
);

/* ---------------- DASHBOARD LAYOUT ---------------- */

function MainApp() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [brandInfo, setBrandInfo] = useState({
    name: "Loading...",
    plan: "FREE",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBrandData = async () => {
      try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);

        const data = await response.json();

        if (data && data.brandProfile) {
          setBrandInfo({
            name: data.brandProfile.name || "Brand Name",
            plan: data.brandProfile.plan || "PRO PLAN",
          });
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("pendingEmail");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Projects":
        return <Projects />;
      case "Discover Creators":
        return <DiscoverCreators />;
      case "Messages":
        return <Messages />;
      case "Performance":
        return <Performance />;
      case "Payments":
        return <Payments />;
      case "Profile":
        return <BrandProfile />;
      case "Settings":
        return <Settings />;
      case "Help":
        return <HelpCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{ 
        height: "64px", 
        background: "#0E0E1C", 
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🤝</span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#EAE8FF" }}>Collabstr</span>
        </div>
        
        <div style={{ position: "relative" }}>
          <div 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)"
            }}
          >
            <div style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "8px", 
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "600",
              color: "#fff"
            }}>
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#EAE8FF" }}>
                {userInfo?.name || "User"}
              </div>
              <div style={{ fontSize: "11px", color: "#6B6988" }}>
                {userInfo?.email || "user@example.com"}
              </div>
            </div>
            <span style={{ color: "#6B6988", fontSize: "12px" }}>▼</span>
          </div>
          
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              background: "#161626",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "12px",
              padding: "8px 0",
              minWidth: "180px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
            }}>
              <div 
                onClick={() => { setActiveTab("Profile"); setShowProfileDropdown(false); }}
                style={{ 
                  padding: "12px 16px", 
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#EAE8FF",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                👤 My Profile
              </div>
              <div 
                onClick={() => { setActiveTab("Settings"); setShowProfileDropdown(false); }}
                style={{ 
                  padding: "12px 16px", 
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#EAE8FF",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                ⚙️ Settings
              </div>
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", margin: "8px 0" }}></div>
              <div 
                onClick={logoutHandler}
                style={{ 
                  padding: "12px 16px", 
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#F43F5E",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: "240px", background: "#111", color: "#fff", borderRight: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={{ padding: "20px" }}>
            <SidebarItem icon="📊" label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
            <SidebarItem icon="📁" label="Projects" active={activeTab === "Projects"} onClick={() => setActiveTab("Projects")} />
            <SidebarItem icon="🌟" label="Discover Creators" active={activeTab === "Discover Creators"} onClick={() => setActiveTab("Discover Creators")} />
            <SidebarItem icon="💬" label="Messages" active={activeTab === "Messages"} onClick={() => setActiveTab("Messages")} />
            <SidebarItem icon="📈" label="Performance" active={activeTab === "Performance"} onClick={() => setActiveTab("Performance")} />
            <SidebarItem icon="💰" label="Payments" active={activeTab === "Payments"} onClick={() => setActiveTab("Payments")} />
            <SidebarItem icon="🏢" label="Brand Profile" active={activeTab === "Profile"} onClick={() => setActiveTab("Profile")} />
            <SidebarItem icon="⚙️" label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
            <SidebarItem icon="🆘" label="Help Center" active={activeTab === "Help"} onClick={() => setActiveTab("Help")} />
          </div>

          <div style={{ marginTop: "auto", padding: "20px" }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))", 
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "12px", 
              padding: "16px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "11px", color: "#9896B8", marginBottom: "4px" }}>BRAND</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#EAE8FF", marginBottom: "8px" }}>
                {brandInfo.name}
              </div>
              <div style={{ 
                display: "inline-block",
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)", 
                padding: "4px 12px", 
                borderRadius: "20px",
                fontSize: "10px", 
                fontWeight: "700", 
                color: "#fff" 
              }}>
                {brandInfo.plan}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "30px", background: "#05050D", overflowY: "auto" }}>
          {loading ? <div>Loading...</div> : renderContent()}
        </main>
      </div>
    </div>
  );
}

/* ---------------- MAIN ROUTER ---------------- */

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

