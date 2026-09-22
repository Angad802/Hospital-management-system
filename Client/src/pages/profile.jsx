import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://hms-backend-api-qhcq.onrender.com";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: ""
    });

    async function fetchProfile() {
        try {
            setLoading(true);
            const token = sessionStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userData = response.data.user;
            setUser(userData);
            setFormData({
                name: userData.name || "",
                phone: userData.phone || ""
            });
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.put(
                `${API_URL}/api/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message || "Profile updated successfully");
            setUser(response.data.user);
            setIsEditing(false);

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to update profile");
        }
    }

    const token = sessionStorage.getItem("token");

    if (!token && !loading) {
        return (
            <main className="profile">
                <div className="page-header">
                    <div>
                        <h1>My Profile</h1>
                        <p>Manage your hospital account credentials</p>
                    </div>
                </div>

                <div className="profile-card empty-profile">
                    <div className="empty-avatar">🔒</div>
                    <h2>Not Logged In</h2>
                    <p>Please log in to your Medicore account to view and manage your profile details.</p>
                    <a href="/login" className="login-nav-btn">Go to Login</a>
                </div>
            </main>
        );
    }

    return (
        <main className="profile">
            <div className="page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your account information and hospital credentials</p>
                </div>
            </div>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
                    </div>

                    <div>
                        <h2>{user?.name || "Staff Member"}</h2>
                        <span className="role-pill">{user?.role || "Staff Member"}</span>
                    </div>
                </div>

                {!isEditing ? (
                    <div className="profile-info">
                        <div className="profile-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={user?.name || ""}
                                readOnly
                            />
                        </div>

                        <div className="profile-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                            />
                        </div>

                        <div className="profile-field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={user?.phone || "Not provided"}
                                readOnly
                            />
                        </div>

                        <div className="profile-field">
                            <label>Role</label>
                            <input
                                type="text"
                                value={user?.role || "Staff"}
                                readOnly
                            />
                        </div>

                        <div className="profile-actions">
                            <button
                                type="button"
                                className="edit-profile-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdateProfile} className="profile-info">
                        <div className="profile-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label>Email Address (read-only)</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="profile-field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Role (read-only)</label>
                            <input
                                type="text"
                                value={user?.role || "Staff"}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="save-profile-btn">
                                Save Changes
                            </button>

                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        name: user?.name || "",
                                        phone: user?.phone || ""
                                    });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}

export default Profile;