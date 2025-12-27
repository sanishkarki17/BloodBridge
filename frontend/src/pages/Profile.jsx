import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import API_BASE_URL from "../api";
export default function Profile() {
  const { user, token, isDonor, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingDonor, setEditingDonor] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [requestFormData, setRequestFormData] = useState({
    name: "",
    blood_group: "",
    district: "",
    city: "",
    phone: "",
    hospital: "",
  });

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [donorData, setDonorData] = useState({
    blood_group: "",
    district: "",
    city: "",
    phone: "",
    available: true,
  });

  useEffect(() => {
    fetchProfile();
    if (user?.role === "recipient") {
      fetchMyRequests();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setFormData({ name: data.name, email: data.email });
      if (data.donorInfo) {
        setDonorData({
          blood_group: data.donorInfo.blood_group || "",
          district: data.donorInfo.district || "",
          city: data.donorInfo.city || "",
          phone: data.donorInfo.phone || "",
          available: data.donorInfo.available === 1,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        updateUser(formData); // Sync global state
        setEditing(false);
        fetchProfile();
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Connection error. Please try again.");
    }
  };

  const handleUpdateDonorInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/donor`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donorData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Donor info updated successfully!");
        if (data.donorInfo) {
          updateUser({ donorInfo: data.donorInfo });
        }
        setEditingDonor(false);
        await fetchProfile();
      } else {
        alert(`Error: ${data.error || "Update failed"}`);
      }
    } catch (err) {
      console.error("Failed to update donor info:", err);
      alert("Failed to update donor info. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonorListing = async (donorId) => {
    if (
      !confirm(
        "Are you sure you want to delete this donor listing? This will not delete your account."
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/donors/${donorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Donor listing removed successfully!");
        await fetchProfile();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Deletion failed"}`);
      }
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (request) => {
    setEditingRequest(request.id);
    setRequestFormData({
      name: request.name,
      blood_group: request.blood_group,
      district: request.district,
      city: request.city,
      phone: request.phone,
      hospital: request.hospital,
    });
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/requests/${editingRequest}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestFormData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Request updated successfully!");
        setEditingRequest(null);
        await fetchMyRequests();
      } else {
        alert(`Error: ${data.error || "Update failed"}`);
      }
    } catch (err) {
      console.error("Failed to update request:", err);
      alert("Failed to update request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Are you sure you want to delete this blood request?")) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/requests/${requestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        alert("Request deleted successfully!");
        await fetchMyRequests();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Deletion failed"}`);
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
      alert("Failed to delete request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-primary-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text">My Profile</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-text-secondary">
                    Name:
                  </span>
                  <p className="text-text font-medium">{profile?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-text-secondary">
                    Email:
                  </span>
                  <p className="text-text font-medium">{profile?.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-text-secondary">
                    Role:
                  </span>
                  <div className="mt-1">
                    <Badge variant={profile?.role}>{profile?.role}</Badge>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Donor Information */}
        {isDonor() && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!editingDonor ? (
                profile?.donorInfo ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-text-secondary">
                        Blood Group:
                      </span>
                      <div className="mt-1">
                        <Badge variant="blood">
                          {profile.donorInfo.blood_group}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text-secondary">
                        Location:
                      </span>
                      <p className="text-text">
                        {profile.donorInfo.city}, {profile.donorInfo.district}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text-secondary">
                        Phone:
                      </span>
                      <p className="text-text">{profile.donorInfo.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text-secondary">
                        Status:
                      </span>
                      <div className="mt-1">
                        <Badge
                          variant={
                            profile.donorInfo.available
                              ? "available"
                              : "default"
                          }
                        >
                          {profile.donorInfo.available
                            ? "Available"
                            : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setEditingDonor(true)}
                      >
                        Edit Donor Info
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteDonorListing(profile.donorInfo.id)
                        }
                      >
                        Delete Listing
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-text-secondary mb-4">
                      No donor information yet.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setEditingDonor(true)}
                    >
                      Add Donor Info
                    </Button>
                  </div>
                )
              ) : (
                <form onSubmit={handleUpdateDonorInfo} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Blood Group *</label>
                      <select
                        value={donorData.blood_group}
                        onChange={(e) =>
                          setDonorData({
                            ...donorData,
                            blood_group: e.target.value,
                          })
                        }
                        required
                        className="input"
                      >
                        <option value="">Select...</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <Input
                      label="Phone"
                      type="tel"
                      value={donorData.phone}
                      onChange={(e) =>
                        setDonorData({ ...donorData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="District"
                      value={donorData.district}
                      onChange={(e) =>
                        setDonorData({ ...donorData, district: e.target.value })
                      }
                    />
                    <Input
                      label="City"
                      value={donorData.city}
                      onChange={(e) =>
                        setDonorData({ ...donorData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={donorData.available}
                      onChange={(e) =>
                        setDonorData({
                          ...donorData,
                          available: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label className="text-sm text-text">
                      Available for donation
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDonor(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* My Requests (Recipients) */}
        {user?.role === "recipient" && (
          <Card>
            <CardHeader>
              <CardTitle>My Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <p className="text-text-secondary">No requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      {editingRequest === req.id ? (
                        <form
                          onSubmit={handleUpdateRequest}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Patient Name"
                              value={requestFormData.name}
                              onChange={(e) =>
                                setRequestFormData({
                                  ...requestFormData,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                            <div>
                              <label className="label">Blood Group *</label>
                              <select
                                value={requestFormData.blood_group}
                                onChange={(e) =>
                                  setRequestFormData({
                                    ...requestFormData,
                                    blood_group: e.target.value,
                                  })
                                }
                                required
                                className="input"
                              >
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="District"
                              value={requestFormData.district}
                              onChange={(e) =>
                                setRequestFormData({
                                  ...requestFormData,
                                  district: e.target.value,
                                })
                              }
                              required
                            />
                            <Input
                              label="City"
                              value={requestFormData.city}
                              onChange={(e) =>
                                setRequestFormData({
                                  ...requestFormData,
                                  city: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <Input
                            label="Hospital"
                            value={requestFormData.hospital}
                            onChange={(e) =>
                              setRequestFormData({
                                ...requestFormData,
                                hospital: e.target.value,
                              })
                            }
                            required
                          />
                          <Input
                            label="Phone"
                            value={requestFormData.phone}
                            onChange={(e) =>
                              setRequestFormData({
                                ...requestFormData,
                                phone: e.target.value,
                              })
                            }
                            required
                          />
                          <div className="flex space-x-2">
                            <Button type="submit" variant="primary" size="sm">
                              Save Changes
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRequest(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-text">{req.name}</p>
                            <Badge variant="blood" className="mt-1">
                              {req.blood_group}
                            </Badge>
                            <p className="text-sm text-text-secondary mt-2">
                              {req.city}, {req.district}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {req.hospital}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRequest(req)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteRequest(req.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
