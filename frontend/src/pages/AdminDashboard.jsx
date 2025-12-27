import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import API_BASE_URL from "../api";
export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRequests: 0,
  });
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchRequests();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users/${userId}/block`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_blocked: currentStatus ? 0 : 1 }),
        }
      );
      if (res.ok) {
        alert(`User ${action}ed successfully.`);
        fetchUsers();
      } else {
        alert("Action failed.");
      }
    } catch (err) {
      console.error("Failed to block/unblock user:", err);
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/requests/${requestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-primary-blue-dark to-primary-blue text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">System Management & Control</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="bg-white text-primary-blue hover:bg-gray-100"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-white hover:bg-primary-blue-dark"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-primary-blue">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    Total Users
                  </p>
                  <p className="text-4xl font-bold text-primary-blue mt-2">
                    {stats.totalUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-blue-tint rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-status-available">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    Total Donors
                  </p>
                  <p className="text-4xl font-bold text-status-available mt-2">
                    {stats.totalDonors}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-status-available"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-primary-red">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    Blood Requests
                  </p>
                  <p className="text-4xl font-bold text-primary-red mt-2">
                    {stats.totalRequests}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-red-tint rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary uppercase">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary uppercase">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary uppercase">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-text">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role}>{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.is_blocked ? "blocked" : "available"}
                        >
                          {user.is_blocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant={user.is_blocked ? "secondary" : "danger"}
                          size="sm"
                          onClick={() =>
                            handleBlockUser(user.id, user.is_blocked)
                          }
                          disabled={loading}
                        >
                          {loading
                            ? "..."
                            : user.is_blocked
                              ? "Unblock"
                              : "Block"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Request Management */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Request Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-red transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge variant="blood">{request.blood_group}</Badge>
                      <span className="font-medium text-text">
                        {request.name}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {request.hospital} • {request.city}, {request.district}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteRequest(request.id)}
                    disabled={loading}
                  >
                    {loading ? "..." : "Delete"}
                  </Button>
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-center text-text-secondary py-8">
                  No active requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
