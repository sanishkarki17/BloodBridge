import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import DonorCard from '../components/DonorCard';
import RequestCard from '../components/RequestCard';

export default function Home() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('donors');
    const [editingRequest, setEditingRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestFormData, setRequestFormData] = useState({
        name: '', blood_group: 'A+', district: '', city: '', hospital: '', phone: ''
    });
    const [editFormData, setEditFormData] = useState({
        name: '', blood_group: '', district: '', city: '', hospital: '', phone: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDonors();
        fetchRequests();
    }, []);

    const fetchDonors = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/donors');
            const data = await res.json();
            setDonors(data);
        } catch (err) {
            console.error('Failed to fetch donors:', err);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/requests');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        }
    };

    const handleDeleteRequest = async (requestId) => {
        if (!confirm('Are you sure you want to delete this blood request?')) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/requests/${requestId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}` }
            });
            if (res.ok) {
                alert('Request deleted successfully.');
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete request.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (request) => {
        setEditingRequest(request.id);
        setEditFormData({
            name: request.name,
            blood_group: request.blood_group,
            district: request.district,
            city: request.city,
            hospital: request.hospital,
            phone: request.phone
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/requests/${editingRequest}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editFormData)
            });
            if (res.ok) {
                alert('Request updated successfully.');
                setEditingRequest(null);
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update request.');
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/api/requests', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestFormData)
            });

            if (res.ok) {
                alert('Blood request created successfully!');
                setIsModalOpen(false);
                setRequestFormData({
                    name: 'Sanish Karki', blood_group: 'A+', district: 'Jhapa', city: 'Bhadrapur', hospital: '', phone: ''
                });
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create request');
            }
        } catch (err) {
            console.error('Create request error:', err);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Professional Header */}
            <header className="bg-white shadow-md border-b-2 border-primary-blue">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text">BloodBridge Nepal</h1>
                                <p className="text-sm text-text-secondary">Blood Donation Management System</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="text-right mr-2">
                                        <p className="text-sm font-medium text-text">{user?.name}</p>
                                        <Badge variant={user?.role} className="text-xs">
                                            {user?.role}
                                        </Badge>
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
                                        Profile
                                    </Button>
                                    {user?.role === 'admin' && (
                                        <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                                            Admin
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="sm" onClick={logout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                                        Login
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white rounded-card p-8 mb-8 shadow-medical">
                    <h2 className="text-3xl font-bold mb-2">Save Lives Through Blood Donation</h2>
                    <p className="text-blue-100 mb-4">Connect donors with recipients across Nepal</p>
                    {!isAuthenticated && (
                        <Button variant="primary" onClick={() => navigate('/register')}>
                            Join as Donor or Recipient
                        </Button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'donors'
                            ? 'text-primary-blue border-b-2 border-primary-blue'
                            : 'text-text-secondary hover:text-text'
                            }`}
                    >
                        Available Donors ({donors.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 font-medium transition-all ${activeTab === 'requests'
                            ? 'text-primary-red border-b-2 border-primary-red'
                            : 'text-text-secondary hover:text-text'
                            }`}
                    >
                        Blood Requests ({requests.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'donors' ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-text">Available Blood Donors</h3>
                            <p className="text-sm text-text-secondary">
                                {donors.filter(d => d.available).length} donors currently available
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donors.map(donor => (
                                <DonorCard
                                    key={donor.id}
                                    donor={donor}
                                    showActions={isAuthenticated}
                                    isOwner={user?.id === donor.user_id}
                                    onEdit={() => navigate('/profile')}
                                    onContact={(d) => alert(`Contacting ${d.name} at ${d.phone}`)}
                                />
                            ))}
                        </div>
                        {donors.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-text-secondary">No donors registered yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-semibold text-text">Urgent Blood Requests</h3>
                                {isAuthenticated && (
                                    <Button size="sm" onClick={() => setIsModalOpen(true)}>
                                        Request Blood
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary">
                                {requests.length} active requests
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map(request => (
                                <div key={request.id}>
                                    {editingRequest === request.id ? (
                                        <div className="bg-white p-6 border-2 border-primary-blue rounded-card shadow-lg animate-in fade-in zoom-in duration-200">
                                            <h4 className="font-bold text-text mb-4">Edit Request</h4>
                                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                                <input
                                                    className="input w-full"
                                                    value={editFormData.name}
                                                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                                    placeholder="Sanish Karki"
                                                    required
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <select
                                                        className="input"
                                                        value={editFormData.blood_group}
                                                        onChange={e => setEditFormData({ ...editFormData, blood_group: e.target.value })}
                                                        required
                                                    >
                                                        <option value="A+">A+</option><option value="A-">A-</option>
                                                        <option value="B+">B+</option><option value="B-">B-</option>
                                                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                                        <option value="O+">O+</option><option value="O-">O-</option>
                                                    </select>
                                                    <input
                                                        className="input"
                                                        value={editFormData.phone}
                                                        onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                                                        placeholder="Phone"
                                                        required
                                                    />
                                                </div>
                                                <input
                                                    className="input w-full"
                                                    value={editFormData.hospital}
                                                    onChange={e => setEditFormData({ ...editFormData, hospital: e.target.value })}
                                                    placeholder="Hospital"
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <Button type="submit" variant="primary" size="sm" className="flex-1" disabled={loading}>
                                                        {loading ? 'Saving...' : 'Save'}
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingRequest(null)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <RequestCard
                                            request={request}
                                            showActions={isAuthenticated}
                                            isOwner={user?.id === request.user_id}
                                            onEdit={handleEditClick}
                                            onDelete={handleDeleteRequest}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {requests.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-text-secondary">No active blood requests.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Request Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Blood Request"
            >
                <form onSubmit={handleCreateRequest} className="space-y-4">
                    <Input
                        label="Patient Name"
                        value={requestFormData.name}
                        onChange={e => setRequestFormData({ ...requestFormData, name: e.target.value })}
                        placeholder="Sanish Karki"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Blood Group</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all outline-none"
                            value={requestFormData.blood_group}
                            onChange={e => setRequestFormData({ ...requestFormData, blood_group: e.target.value })}
                        >
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="District"
                            value={requestFormData.district}
                            onChange={e => setRequestFormData({ ...requestFormData, district: e.target.value })}
                            placeholder="Jhapa"
                            required
                        />
                        <Input
                            label="City"
                            value={requestFormData.city}
                            onChange={e => setRequestFormData({ ...requestFormData, city: e.target.value })}
                            placeholder="Bhadrapur"
                            required
                        />
                    </div>

                    <Input
                        label="Hospital"
                        value={requestFormData.hospital}
                        onChange={e => setRequestFormData({ ...requestFormData, hospital: e.target.value })}
                        placeholder="Nobel Medical College"
                        required
                    />

                    <Input
                        label="Contact Phone"
                        value={requestFormData.phone}
                        onChange={e => setRequestFormData({ ...requestFormData, phone: e.target.value })}
                        placeholder="98XXXXXXXX"
                        required
                    />

                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Posting...' : 'Post Request'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-text-secondary">
                        © 2025 BloodBridge Nepal • Hospital-Grade Blood Donation Management System
                    </p>
                </div>
            </footer>
        </div>
    );
}
