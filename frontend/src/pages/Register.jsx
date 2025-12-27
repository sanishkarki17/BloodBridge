import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import API_BASE_URL from "../api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    blood_group: "",
    district: "",
    city: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        // Redirect based on role
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue via-primary-blue-dark to-primary-red flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-red rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-text-secondary">Join BloodBridge Nepal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-primary-red rounded-lg">
            <p className="text-sm text-primary-red font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="label">Select Your Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "donor" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.role === "donor"
                    ? "border-primary-blue bg-accent-blue-tint"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center">
                  <Badge variant="donor" className="mb-2">
                    Donor
                  </Badge>
                  <p className="text-sm text-text-secondary">
                    I want to donate blood
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "recipient" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.role === "recipient"
                    ? "border-primary-red bg-accent-red-tint"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center">
                  <Badge variant="recipient" className="mb-2">
                    Recipient
                  </Badge>
                  <p className="text-sm text-text-secondary">I need blood</p>
                </div>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Sanish Karki"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="example@bloodbridge.com"
            />
          </div>

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            placeholder="Minimum 6 characters"
          />

          {/* Donor-specific fields */}
          {formData.role === "donor" && (
            <div className="p-4 bg-accent-blue-tint border border-primary-blue-light rounded-lg">
              <h3 className="font-semibold text-text mb-4">
                Donor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Blood Group *</label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_group: e.target.value })
                    }
                    required
                    className="input"
                  >
                    <option value="">Select Blood Group</option>
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
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="98XXXXXXXX"
                />
                <Input
                  label="District"
                  type="text"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="Jhapa"
                />
                <Input
                  label="City"
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Bhadrapur"
                />
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-blue hover:text-primary-blue-dark font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
