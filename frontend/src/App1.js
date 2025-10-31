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
  const [loading, setLoading] = useState(false);

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
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {notification && (
        <div
          className={`alert alert-${
            notification.type === "success" ? "success" : "danger"
          } position-fixed top-0 start-50 translate-middle-x mt-3`}
          style={{ zIndex: 9999, minWidth: "300px" }}
        >
          <div className="d-flex align-items-center">
            {notification.type === "success" ? (
              <CheckCircle size={20} className="me-2" />
            ) : (
              <AlertCircle size={20} className="me-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <Brain className="me-2" />
            <span className="fw-bold">MindMap Journal</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("home")}
                >
                  Home
                </button>
              </li>
              {currentUser.role === "admin" ? (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link text-white"
                      onClick={() => setView("operations")}
                    >
                      Operations Hub
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link text-white"
                      onClick={() => setView("users")}
                    >
                      User Management
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-white"
                    onClick={() => setView("myJournals")}
                  >
                    My Journals
                  </button>
                </li>
              )}
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => setView("profile")}
                >
                  Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-1" /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
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
        const result = await API.signup({
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
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <Brain size={48} className="text-primary mb-3" />
                  <h2 className="fw-bold">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-muted">
                    MindMap Journal - Visual Thinking & Mental Wellness
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Full Name *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          className={`form-control ${
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
                        <div className="invalid-feedback d-block">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Email Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className={`form-control ${
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
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
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
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Confirm Password *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <Lock size={18} />
                        </span>
                        <input
                          type="password"
                          className={`form-control ${
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
                        <div className="invalid-feedback d-block">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Processing...
                      </>
                    ) : isLogin ? (
                      "Login"
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
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
                        : "Already have an account? Login"}
                    </button>
                  </div>
                </form>

                {isLogin && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>Demo Credentials:</strong>
                      <br />
                      Admin: admin@mindmap.com / Admin@123
                      <br />
                      Or create your own account
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 fw-bold mb-3">
            Welcome, {currentUser.name}! 👋
          </h1>
          <p className="lead text-muted">
            Your Visual Thinking & Mental Wellness Companion
          </p>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                <Brain size={32} className="text-primary" />
              </div>
              <h3 className="fw-bold mb-1">{stats.totalJournals}</h3>
              <p className="text-muted mb-0">Total Entries</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-3">
                <Calendar size={32} className="text-success" />
              </div>
              <h3 className="fw-bold mb-1">{stats.thisWeekJournals}</h3>
              <p className="text-muted mb-0">This Week</p>
            </div>
          </div>
        </div>

        {currentUser.role === "admin" && (
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex p-3 mb-3">
                  <Users size={32} className="text-info" />
                </div>
                <h3 className="fw-bold mb-1">{stats.totalUsers}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex p-3 mb-3">
                <Activity size={32} className="text-warning" />
              </div>
              <h3 className="fw-bold mb-1">
                {stats.totalJournals > 0
                  ? Math.round(
                      (stats.moodDistribution.happy / stats.totalJournals) * 100
                    )
                  : 0}
                %
              </h3>
              <p className="text-muted mb-0">Happy Moods</p>
            </div>
          </div>
        </div>
      </div>

      {currentUser.role === "admin" ? (
        <div className="card border-0 shadow-sm bg-primary text-white mb-5">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-3">🔐 Admin Capabilities</h4>
            <div className="row">
              <div className="col-md-3 mb-3">
                <h6>👥 User Management</h6>
                <p className="small mb-0">
                  Add, update, and remove users from the system
                </p>
              </div>
              <div className="col-md-3 mb-3">
                <h6>📊 View All Journals</h6>
                <p className="small mb-0">
                  Access and manage all user journal entries
                </p>
              </div>
              <div className="col-md-3 mb-3">
                <h6>✏️ Full CRUD Operations</h6>
                <p className="small mb-0">
                  Complete control over all system data
                </p>
              </div>
              <div className="col-md-3 mb-3">
                <h6>📈 Analytics Dashboard</h6>
                <p className="small mb-0">
                  View comprehensive system statistics
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-3">Your Dashboard</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div className="rounded bg-primary bg-opacity-10 p-2 me-3">
                    <Calendar className="text-primary" />
                  </div>
                  <div>
                    <h6 className="mb-0">Create Journal Entries</h6>
                    <small className="text-muted">
                      Document your thoughts and feelings
                    </small>
                  </div>
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📊 Consolidated Operations Hub</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "journals" ? "active" : ""}`}
            onClick={() => setActiveTab("journals")}
          >
            All Journals ({journals.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            All Users ({users.length})
          </button>
        </li>
      </ul>

      {activeTab === "journals" && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Title</th>
                    <th>User</th>
                    <th>Mood</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map((journal) => (
                    <tr key={journal._id}>
                      <td>{journal.title}</td>
                      <td>{journal.userId?.name || "Unknown"}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            journal.mood === "happy"
                              ? "success"
                              : journal.mood === "neutral"
                              ? "warning"
                              : "danger"
                          }`}
                        >
                          {journal.mood}
                        </span>
                      </td>
                      <td>
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-danger"
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
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Journals</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            user.role === "admin" ? "danger" : "primary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {
                          journals.filter((j) => j.userId?._id === user._id)
                            .length
                        }
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">👥 User Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="me-2" />
          Add New User
        </button>
      </div>

      {showAddModal && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Add New User</h5>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-md-2 mb-3 d-flex align-items-end">
                <button
                  className="btn btn-success me-2"
                  onClick={handleAddUser}
                >
                  <Save size={16} className="me-1" />
                  Save
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
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {editingUser?._id === user._id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUser?._id === user._id ? (
                        <input
                          type="email"
                          className="form-control form-control-sm"
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
                    <td>
                      {editingUser?._id === user._id ? (
                        <select
                          className="form-select form-select-sm"
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
                          className={`badge bg-${
                            user.role === "admin" ? "danger" : "primary"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      {editingUser?._id === user._id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() =>
                              handleUpdateUser(user._id, editingUser)
                            }
                          >
                            <Save size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingUser(null)}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📖 My Journals</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="me-2" />
          New Entry
        </button>
      </div>

      {showAddModal && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Create New Journal Entry</h5>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={newJournal.title}
                onChange={(e) =>
                  setNewJournal({ ...newJournal, title: e.target.value })
                }
                placeholder="Enter title..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows="4"
                value={newJournal.content}
                onChange={(e) =>
                  setNewJournal({ ...newJournal, content: e.target.value })
                }
                placeholder="Write your thoughts..."
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Mood</label>
              <select
                className="form-select"
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
              <button className="btn btn-success" onClick={handleAddJournal}>
                <Save size={16} className="me-1" />
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
        </div>
      )}

      <div className="row g-4">
        {journals.map((journal) => (
          <div className="col-md-6 col-lg-4" key={journal._id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                {editingJournal?._id === journal._id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editingJournal.title}
                      onChange={(e) =>
                        setEditingJournal({
                          ...editingJournal,
                          title: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="form-control mb-2"
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
                      className="form-select mb-2"
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
                        className="btn btn-sm btn-success"
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
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold">{journal.title}</h5>
                      <span
                        className={`badge bg-${
                          journal.mood === "happy"
                            ? "success"
                            : journal.mood === "neutral"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {journal.mood === "happy"
                          ? "😊"
                          : journal.mood === "neutral"
                          ? "😐"
                          : "😢"}
                      </span>
                    </div>
                    <p className="card-text text-muted">{journal.content}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {new Date(journal.createdAt).toLocaleDateString()}
                      </small>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => setEditingJournal(journal)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
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
          </div>
        ))}
      </div>

      {journals.length === 0 && (
        <div className="text-center py-5">
          <Brain size={64} className="text-muted mb-3" />
          <h4 className="text-muted">No journal entries yet</h4>
          <p className="text-muted">
            Start documenting your thoughts and feelings!
          </p>
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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">👤 Profile Information</h3>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Name:</div>
                <div className="col-md-8">{currentUser.name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Email:</div>
                <div className="col-md-8">{currentUser.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Role:</div>
                <div className="col-md-8">
                  <span
                    className={`badge bg-${
                      currentUser.role === "admin" ? "danger" : "primary"
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Member Since:</div>
                <div className="col-md-8">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">🔒 Change Password</h4>
                {!showPasswordChange && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordChange && (
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
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
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <small className="text-muted">
                      Must be at least 8 characters
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
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
                      className="btn btn-success"
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
      </div>
    </div>
  );
};

export default MindMapJournal;
