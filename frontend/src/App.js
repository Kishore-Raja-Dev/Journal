import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Brain,
  Calendar,
  Activity,
  Users,
  Sparkles,
  TrendingUp,
  Heart,
  Zap,
} from "lucide-react";

// API Configuration - CHANGE THIS TO YOUR BACKEND URL
const API_BASE_URL = "http://localhost:5000/api";

const API = {
  signup: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return { user: data.user, token: data.token };
  },

  changePassword: async (token, oldPassword, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Password change failed");
    return data;
  },

  getUsers: async (token) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data;
  },

  updateUser: async (token, userId, updates) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update user");
    return data;
  },

  deleteUser: async (token, userId) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete user");
    return data;
  },

  getJournals: async (token) => {
    const res = await fetch(`${API_BASE_URL}/journals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch journals");
    return data;
  },

  getAllJournals: async (token) => {
    const res = await fetch(`${API_BASE_URL}/journals/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch journals");
    return data;
  },

  createJournal: async (token, journal) => {
    const res = await fetch(`${API_BASE_URL}/journals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(journal),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create journal");
    return data;
  },

  updateJournal: async (token, journalId, updates) => {
    const res = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update journal");
    return data;
  },

  deleteJournal: async (token, journalId) => {
    const res = await fetch(`${API_BASE_URL}/journals/${journalId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete journal");
    return data;
  },
};

const MindMapJournal = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [view, setView] = useState("home");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setView("home");
    showNotification("Logged out successfully! 👋");
  };

  if (!currentUser) {
    return (
      <AuthPage
        setCurrentUser={setCurrentUser}
        setAuthToken={setAuthToken}
        showNotification={showNotification}
      />
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
          margin: 0;
          padding: 0;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .gradient-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        
        .stat-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
        }
        
        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }
        
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-weight: 700;
          padding: 12px 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
          color: white;
        }
        
        .btn-danger-gradient {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border: none;
          color: white;
          font-weight: 700;
          padding: 12px 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        
        .btn-danger-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(245, 87, 108, 0.5);
          color: white;
        }
        
        .btn-success-gradient {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          border: none;
          color: white;
          font-weight: 700;
          padding: 12px 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
        }
        
        .btn-success-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(56, 239, 125, 0.5);
          color: white;
        }
        
        .navbar-custom {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
          border-bottom: 2px solid rgba(102, 126, 234, 0.2);
        }
        
        .nav-btn {
          background: transparent;
          border: 2px solid transparent;
          color: #667eea;
          font-weight: 700;
          padding: 10px 25px;
          border-radius: 12px;
          margin: 0 5px;
          transition: all 0.3s ease;
        }
        
        .nav-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }
        
        .nav-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .notification {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          min-width: 350px;
          border-radius: 15px;
          padding: 20px 25px;
          font-weight: 600;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.5s ease;
        }
        
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .form-control-custom {
          border: 2px solid rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          padding: 12px 20px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .form-control-custom:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          outline: none;
        }
        
        .table-custom {
          border-radius: 20px;
          overflow: hidden;
          background: white;
        }
        
        .table-custom thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .table-custom tbody tr {
          transition: all 0.3s ease;
        }
        
        .table-custom tbody tr:hover {
          background: rgba(102, 126, 234, 0.05);
          transform: scale(1.01);
        }
        
        .journal-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          transition: all 0.3s ease;
          border: 2px solid rgba(102, 126, 234, 0.1);
          height: 100%;
        }
        
        .journal-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
          border-color: #667eea;
        }
        
        .mood-badge {
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 14px;
        }
        
        .mood-happy {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
        }
        
        .mood-neutral {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        
        .mood-sad {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
        }
        
        .spinner-custom {
          width: 60px;
          height: 60px;
          border: 5px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          position: relative;
          overflow: hidden;
        }
        
        .auth-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
          animation: float 6s ease-in-out infinite;
        }
        
        .auth-blob-1 {
          width: 400px;
          height: 400px;
          background: rgba(102, 126, 234, 0.4);
          top: -100px;
          left: -100px;
        }
        
        .auth-blob-2 {
          width: 350px;
          height: 350px;
          background: rgba(240, 147, 251, 0.4);
          bottom: -100px;
          right: -100px;
          animation-delay: 2s;
        }
        
        .auth-blob-3 {
          width: 300px;
          height: 300px;
          background: rgba(118, 75, 162, 0.4);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }
        
        .auth-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 50px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 10;
          max-width: 500px;
          width: 100%;
        }
        
        .brand-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .admin-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 30px;
          color: white;
          margin-bottom: 30px;
        }
        
        .admin-banner h4 {
          font-weight: 800;
          margin-bottom: 20px;
        }
        
        .feature-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }
        
        .feature-box:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        {notification && (
          <div
            className={`notification ${
              notification.type === "success" ? "bg-success" : "bg-danger"
            } text-white`}
          >
            <div className="d-flex align-items-center">
              {notification.type === "success" ? (
                <CheckCircle size={24} className="me-3" />
              ) : (
                <AlertCircle size={24} className="me-3" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center">
              <div
                className="brand-icon"
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "15px",
                  marginBottom: "0",
                }}
              >
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <h4
                  className="mb-0 fw-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  MindMap
                </h4>
                <small className="text-muted">Visual Wellness</small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setView("home")}
                className={`nav-btn ${view === "home" ? "active" : ""}`}
              >
                Home
              </button>
              {currentUser.role === "admin" ? (
                <>
                  <button
                    onClick={() => setView("operations")}
                    className={`nav-btn ${
                      view === "operations" ? "active" : ""
                    }`}
                  >
                    Operations
                  </button>
                  <button
                    onClick={() => setView("users")}
                    className={`nav-btn ${view === "users" ? "active" : ""}`}
                  >
                    Users
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setView("myJournals")}
                  className={`nav-btn ${view === "myJournals" ? "active" : ""}`}
                >
                  My Journals
                </button>
              )}
              <button
                onClick={() => setView("profile")}
                className={`nav-btn ${view === "profile" ? "active" : ""}`}
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="btn-danger-gradient d-flex align-items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container-fluid px-4 py-4">
          {view === "home" && (
            <HomePage currentUser={currentUser} authToken={authToken} />
          )}
          {view === "operations" && currentUser.role === "admin" && (
            <OperationsHub
              authToken={authToken}
              showNotification={showNotification}
            />
          )}
          {view === "users" && currentUser.role === "admin" && (
            <UserManagement
              authToken={authToken}
              showNotification={showNotification}
            />
          )}
          {view === "myJournals" && currentUser.role === "user" && (
            <UserJournals
              currentUser={currentUser}
              authToken={authToken}
              showNotification={showNotification}
            />
          )}
          {view === "profile" && (
            <ProfilePage
              currentUser={currentUser}
              authToken={authToken}
              showNotification={showNotification}
            />
          )}
        </div>
      </div>
    </>
  );
};

const AuthPage = ({ setCurrentUser, setAuthToken, showNotification }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = "Name is required";
      else if (formData.name.trim().length < 2)
        newErrors.name = "Name must be at least 2 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { user, token } = await API.login(
          formData.email,
          formData.password
        );
        setCurrentUser(user);
        setAuthToken(token);
        showNotification(`Welcome back, ${user.name}! 🎉`);
      } else {
        await API.signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        const { user, token } = await API.login(
          formData.email,
          formData.password
        );
        setCurrentUser(user);
        setAuthToken(token);
        showNotification(
          `Account created successfully! Welcome, ${user.name}! 🎊`
        );
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      <div className="auth-blob auth-blob-3"></div>

      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="brand-icon float-animation">
            <Brain size={48} className="text-white" />
          </div>
          <h2
            className="fw-black mb-2"
            style={{
              fontSize: "36px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isLogin ? "Welcome Back" : "Join Us"}
          </h2>
          <p className="text-muted fw-semibold">
            Your Visual Wellness Journey Starts Here
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <User size={20} style={{ color: "#667eea" }} />
                </span>
                <input
                  type="text"
                  className={`form-control form-control-custom border-start-0 ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <div className="text-danger mt-1 small fw-semibold">
                  {errors.name}
                </div>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Mail size={20} style={{ color: "#667eea" }} />
              </span>
              <input
                type="email"
                className={`form-control form-control-custom border-start-0 ${
                  errors.email ? "is-invalid" : ""
                }`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && (
              <div className="text-danger mt-1 small fw-semibold">
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Lock size={20} style={{ color: "#667eea" }} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control form-control-custom border-start-0 border-end-0 ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderRadius: "0 12px 12px 0" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-danger mt-1 small fw-semibold">
                {errors.password}
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label fw-bold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Lock size={20} style={{ color: "#667eea" }} />
                </span>
                <input
                  type="password"
                  className={`form-control form-control-custom border-start-0 ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-danger mt-1 small fw-semibold">
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-gradient w-100 py-3 mb-3"
            disabled={loading}
            style={{ fontSize: "18px" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="btn btn-link text-decoration-none fw-bold"
              style={{ color: "#667eea" }}
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({
                  email: "",
                  password: "",
                  name: "",
                  confirmPassword: "",
                });
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </form>

        {isLogin && (
          <div
            className="mt-4 p-3 rounded"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              border: "2px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <p className="mb-2 fw-bold" style={{ color: "#667eea" }}>
              🎯 Demo Credentials
            </p>
            <small className="d-block mb-1">
              <strong>Admin:</strong> admin@mindmap.com / Admin@123
            </small>
            <small className="d-block">Or create your own account above!</small>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage = ({ currentUser, authToken }) => {
  const [stats, setStats] = useState({
    totalJournals: 0,
    thisWeekJournals: 0,
    totalUsers: 0,
    moodDistribution: { happy: 0, neutral: 0, sad: 0 },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const journals =
          currentUser.role === "admin"
            ? await API.getAllJournals(authToken)
            : await API.getJournals(authToken);

        const users =
          currentUser.role === "admin" ? await API.getUsers(authToken) : [];

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const moodDist = journals.reduce(
          (acc, j) => {
            acc[j.mood] = (acc[j.mood] || 0) + 1;
            return acc;
          },
          { happy: 0, neutral: 0, sad: 0 }
        );

        setStats({
          totalJournals: journals.length,
          thisWeekJournals: journals.filter(
            (j) => new Date(j.createdAt) >= weekAgo
          ).length,
          totalUsers: users.length,
          moodDistribution: moodDist,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
  }, [currentUser, authToken]);

  return (
    <div>
      <div className="text-center mb-5">
        <h1
          className="display-4 fw-black mb-3 float-animation"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome, {currentUser.name}! 👋
        </h1>
        <p className="lead text-muted fw-semibold">
          Your Visual Thinking & Mental Wellness Companion
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="stat-card text-center">
            <div
              className="stat-icon mx-auto"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Brain size={32} className="text-white" />
            </div>
            <h3
              className="display-4 fw-black mb-2"
              style={{ color: "#667eea" }}
            >
              {stats.totalJournals}
            </h3>
            <p className="text-muted fw-bold mb-0">Total Entries</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card text-center">
            <div
              className="stat-icon mx-auto"
              style={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              }}
            >
              <Calendar size={32} className="text-white" />
            </div>
            <h3
              className="display-4 fw-black mb-2"
              style={{ color: "#11998e" }}
            >
              {stats.thisWeekJournals}
            </h3>
            <p className="text-muted fw-bold mb-0">This Week</p>
          </div>
        </div>

        {currentUser.role === "admin" && (
          <div className="col-md-3">
            <div className="stat-card text-center">
              <div
                className="stat-icon mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              >
                <Users size={32} className="text-white" />
              </div>
              <h3
                className="display-4 fw-black mb-2"
                style={{ color: "#f093fb" }}
              >
                {stats.totalUsers}
              </h3>
              <p className="text-muted fw-bold mb-0">Total Users</p>
            </div>
          </div>
        )}

        <div className="col-md-3">
          <div className="stat-card text-center">
            <div
              className="stat-icon mx-auto"
              style={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              }}
            >
              <Activity size={32} className="text-white" />
            </div>
            <h3
              className="display-4 fw-black mb-2"
              style={{ color: "#fa709a" }}
            >
              {stats.totalJournals > 0
                ? Math.round(
                    (stats.moodDistribution.happy / stats.totalJournals) * 100
                  )
                : 0}
              %
            </h3>
            <p className="text-muted fw-bold mb-0">Happy Moods</p>
          </div>
        </div>
      </div>

      {currentUser.role === "admin" ? (
        <div className="admin-banner">
          <h4 className="d-flex align-items-center gap-2">
            <Sparkles size={28} />
            Admin Capabilities
          </h4>
          <div className="row">
            <div className="col-md-3">
              <div className="feature-box">
                <Users size={24} className="mb-2" />
                <h6 className="fw-bold">User Management</h6>
                <p className="small mb-0">
                  Add, update, and remove users from the system
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box">
                <Brain size={24} className="mb-2" />
                <h6 className="fw-bold">View All Journals</h6>
                <p className="small mb-0">
                  Access and manage all user journal entries
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box">
                <Zap size={24} className="mb-2" />
                <h6 className="fw-bold">Full CRUD Operations</h6>
                <p className="small mb-0">
                  Complete control over all system data
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box">
                <TrendingUp size={24} className="mb-2" />
                <h6 className="fw-bold">Analytics Dashboard</h6>
                <p className="small mb-0">
                  View comprehensive system statistics
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gradient-card rounded shadow p-4">
          <h4 className="fw-black mb-4" style={{ color: "#667eea" }}>
            <Heart size={28} className="me-2" />
            Your Dashboard
          </h4>
          <div className="row g-4">
            <div className="col-md-6">
              <div
                className="d-flex align-items-center p-4 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <div
                  className="stat-icon me-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    width: "60px",
                    height: "60px",
                    marginBottom: "0",
                  }}
                >
                  <Calendar className="text-white" size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Create Journal Entries</h6>
                  <small className="text-muted">
                    Document your thoughts and feelings
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="d-flex align-items-center p-4 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)",
                }}
              >
                <div
                  className="stat-icon me-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    width: "60px",
                    height: "60px",
                    marginBottom: "0",
                  }}
                >
                  <Activity className="text-white" size={28} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Track Your Wellness</h6>
                  <small className="text-muted">
                    Monitor your mental health journey
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OperationsHub = ({ authToken, showNotification }) => {
  const [activeTab, setActiveTab] = useState("journals");
  const [journals, setJournals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [journalsData, usersData] = await Promise.all([
        API.getAllJournals(authToken),
        API.getUsers(authToken),
      ]);
      setJournals(journalsData);
      setUsers(usersData);
    } catch (error) {
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJournal = async (journalId) => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await API.deleteJournal(authToken, journalId);
        showNotification("Journal deleted successfully! 🗑️");
        loadData();
      } catch (error) {
        showNotification("Failed to delete journal", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-custom mx-auto"></div>
        <p className="mt-3 text-muted fw-bold">Loading data...</p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="fw-black mb-4"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        📊 Consolidated Operations Hub
      </h2>

      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn-gradient flex-fill ${
            activeTab !== "journals" ? "opacity-50" : ""
          }`}
          onClick={() => setActiveTab("journals")}
        >
          All Journals ({journals.length})
        </button>
        <button
          className={`btn-gradient flex-fill ${
            activeTab !== "users" ? "opacity-50" : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          All Users ({users.length})
        </button>
      </div>

      {activeTab === "journals" && (
        <div className="table-custom shadow">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th className="px-4 py-3 fw-bold">Title</th>
                <th className="px-4 py-3 fw-bold">User</th>
                <th className="px-4 py-3 fw-bold">Mood</th>
                <th className="px-4 py-3 fw-bold">Date</th>
                <th className="px-4 py-3 fw-bold text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((journal) => (
                <tr key={journal._id}>
                  <td className="px-4 py-3 fw-semibold">{journal.title}</td>
                  <td className="px-4 py-3">
                    {journal.userId?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`mood-badge ${
                        journal.mood === "happy"
                          ? "mood-happy"
                          : journal.mood === "neutral"
                          ? "mood-neutral"
                          : "mood-sad"
                      }`}
                    >
                      {journal.mood === "happy"
                        ? "😊"
                        : journal.mood === "neutral"
                        ? "😐"
                        : "😢"}{" "}
                      {journal.mood}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      className="btn btn-sm btn-danger-gradient"
                      onClick={() => handleDeleteJournal(journal._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div className="table-custom shadow">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th className="px-4 py-3 fw-bold">Name</th>
                <th className="px-4 py-3 fw-bold">Email</th>
                <th className="px-4 py-3 fw-bold">Role</th>
                <th className="px-4 py-3 fw-bold">Journals</th>
                <th className="px-4 py-3 fw-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 fw-semibold">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`mood-badge ${
                        user.role === "admin" ? "mood-neutral" : "mood-happy"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 fw-bold"
                    style={{ color: "#667eea" }}
                  >
                    {journals.filter((j) => j.userId?._id === user._id).length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const UserManagement = ({ authToken, showNotification }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await API.getUsers(authToken));
    } catch (error) {
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await API.signup(newUser);
      showNotification("User added successfully! ✅");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await API.updateUser(authToken, userId, updates);
      showNotification("User updated successfully! ✅");
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.deleteUser(authToken, userId);
        showNotification("User deleted successfully! 🗑️");
        loadUsers();
      } catch (error) {
        showNotification("Failed to delete user", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-custom mx-auto"></div>
        <p className="mt-3 text-muted fw-bold">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="fw-black"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          👥 User Management
        </h2>
        <button
          className="btn-gradient d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      {showAddModal && (
        <div className="gradient-card rounded shadow p-4 mb-4">
          <h5 className="fw-bold mb-4">Add New User</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                className="form-control form-control-custom"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control form-control-custom"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-custom"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Role</label>
              <select
                className="form-select form-control-custom"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end gap-2">
              <button
                className="btn-success-gradient flex-fill"
                onClick={handleAddUser}
              >
                <Save size={16} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-custom shadow">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th className="px-4 py-3 fw-bold">Name</th>
              <th className="px-4 py-3 fw-bold">Email</th>
              <th className="px-4 py-3 fw-bold">Role</th>
              <th className="px-4 py-3 fw-bold">Created At</th>
              <th className="px-4 py-3 fw-bold text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3">
                  {editingUser?._id === user._id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm form-control-custom"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="fw-semibold">{user.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingUser?._id === user._id ? (
                    <input
                      type="email"
                      className="form-control form-control-sm form-control-custom"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingUser?._id === user._id ? (
                    <select
                      className="form-select form-select-sm form-control-custom"
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`mood-badge ${
                        user.role === "admin" ? "mood-neutral" : "mood-happy"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-end">
                  {editingUser?._id === user._id ? (
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm btn-success-gradient"
                        onClick={() => handleUpdateUser(user._id, editingUser)}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingUser(null)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm btn-gradient"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger-gradient"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserJournals = ({ currentUser, authToken, showNotification }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    setLoading(true);
    try {
      setJournals(await API.getJournals(authToken));
    } catch (error) {
      showNotification("Failed to load journals", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJournal = async () => {
    try {
      await API.createJournal(authToken, newJournal);
      showNotification("Journal created successfully! 📝");
      setShowAddModal(false);
      setNewJournal({ title: "", content: "", mood: "neutral" });
      loadJournals();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleUpdateJournal = async (journalId, updates) => {
    try {
      await API.updateJournal(authToken, journalId, updates);
      showNotification("Journal updated successfully! ✅");
      setEditingJournal(null);
      loadJournals();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeleteJournal = async (journalId) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await API.deleteJournal(authToken, journalId);
        showNotification("Journal deleted successfully! 🗑️");
        loadJournals();
      } catch (error) {
        showNotification("Failed to delete journal", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-custom mx-auto"></div>
        <p className="mt-3 text-muted fw-bold">Loading journals...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          className="fw-black"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📖 My Journals
        </h2>
        <button
          className="btn-gradient d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      {showAddModal && (
        <div className="gradient-card rounded shadow p-4 mb-4">
          <h5 className="fw-bold mb-4">Create New Journal Entry</h5>
          <div className="mb-3">
            <label className="form-label fw-bold">Title</label>
            <input
              type="text"
              className="form-control form-control-custom"
              value={newJournal.title}
              onChange={(e) =>
                setNewJournal({ ...newJournal, title: e.target.value })
              }
              placeholder="Enter title..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Content</label>
            <textarea
              className="form-control form-control-custom"
              rows="4"
              value={newJournal.content}
              onChange={(e) =>
                setNewJournal({ ...newJournal, content: e.target.value })
              }
              placeholder="Write your thoughts..."
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Mood</label>
            <select
              className="form-select form-control-custom"
              value={newJournal.mood}
              onChange={(e) =>
                setNewJournal({ ...newJournal, mood: e.target.value })
              }
            >
              <option value="happy">😊 Happy</option>
              <option value="neutral">😐 Neutral</option>
              <option value="sad">😢 Sad</option>
            </select>
          </div>
          <div className="d-flex gap-2">
            <button className="btn-success-gradient" onClick={handleAddJournal}>
              <Save size={16} className="me-2" />
              Save Entry
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="row g-4">
        {journals.map((journal) => (
          <div className="col-md-6 col-lg-4" key={journal._id}>
            <div className="journal-card">
              {editingJournal?._id === journal._id ? (
                <>
                  <input
                    type="text"
                    className="form-control form-control-custom mb-3"
                    value={editingJournal.title}
                    onChange={(e) =>
                      setEditingJournal({
                        ...editingJournal,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control form-control-custom mb-3"
                    rows="3"
                    value={editingJournal.content}
                    onChange={(e) =>
                      setEditingJournal({
                        ...editingJournal,
                        content: e.target.value,
                      })
                    }
                  ></textarea>
                  <select
                    className="form-select form-control-custom mb-3"
                    value={editingJournal.mood}
                    onChange={(e) =>
                      setEditingJournal({
                        ...editingJournal,
                        mood: e.target.value,
                      })
                    }
                  >
                    <option value="happy">😊 Happy</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="sad">😢 Sad</option>
                  </select>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success-gradient"
                      onClick={() =>
                        handleUpdateJournal(journal._id, editingJournal)
                      }
                    >
                      <Save size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingJournal(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold mb-0">{journal.title}</h5>
                    <span
                      className={`mood-badge ${
                        journal.mood === "happy"
                          ? "mood-happy"
                          : journal.mood === "neutral"
                          ? "mood-neutral"
                          : "mood-sad"
                      }`}
                    >
                      {journal.mood === "happy"
                        ? "😊"
                        : journal.mood === "neutral"
                        ? "😐"
                        : "😢"}
                    </span>
                  </div>
                  <p className="text-muted mb-4">{journal.content}</p>
                  <div
                    className="d-flex justify-content-between align-items-center pt-3"
                    style={{ borderTop: "2px solid rgba(102, 126, 234, 0.1)" }}
                  >
                    <small className="text-muted fw-semibold">
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </small>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-gradient"
                        onClick={() => setEditingJournal(journal)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-danger-gradient"
                        onClick={() => handleDeleteJournal(journal._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {journals.length === 0 && (
        <div className="text-center py-5 gradient-card rounded shadow">
          <div
            className="brand-icon mx-auto mb-4 float-animation"
            style={{ width: "100px", height: "100px" }}
          >
            <Brain size={64} className="text-white" />
          </div>
          <h4 className="fw-bold mb-3">No journal entries yet</h4>
          <p className="text-muted mb-4">
            Start documenting your thoughts and feelings!
          </p>
          <button
            className="btn-gradient"
            onClick={() => setShowAddModal(true)}
          >
            Create Your First Entry
          </button>
        </div>
      )}
    </div>
  );
};

const ProfilePage = ({ currentUser, authToken, showNotification }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);
    try {
      await API.changePassword(
        authToken,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      showNotification("Password changed successfully! 🔒");
      setShowPasswordChange(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="gradient-card rounded shadow p-4 mb-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="stat-icon me-3"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: "0",
              }}
            >
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="fw-bold mb-1">Profile Information</h3>
              <p className="text-muted mb-0">Manage your account details</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <small className="text-muted fw-bold d-block mb-1">Name</small>
                <span className="fw-bold">{currentUser.name}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <small className="text-muted fw-bold d-block mb-1">Email</small>
                <span className="fw-bold">{currentUser.email}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <small className="text-muted fw-bold d-block mb-2">Role</small>
                <span
                  className={`mood-badge ${
                    currentUser.role === "admin" ? "mood-neutral" : "mood-happy"
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="p-3 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <small className="text-muted fw-bold d-block mb-1">
                  Member Since
                </small>
                <span className="fw-bold">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded shadow p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div
                className="stat-icon me-3"
                style={{
                  background:
                    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  marginBottom: "0",
                  width: "50px",
                  height: "50px",
                }}
              >
                <Lock size={24} className="text-white" />
              </div>
              <div>
                <h4 className="fw-bold mb-1">Change Password</h4>
                <small className="text-muted">
                  Update your security credentials
                </small>
              </div>
            </div>
            {!showPasswordChange && (
              <button
                className="btn-gradient"
                onClick={() => setShowPasswordChange(true)}
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordChange && (
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label fw-bold">Current Password</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">New Password</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
                <small className="text-muted d-block mt-1">
                  Must be at least 8 characters
                </small>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn-success-gradient"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMapJournal;
