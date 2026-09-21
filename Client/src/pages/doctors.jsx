import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [editingDoctorId, setEditingDoctorId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        department: "",
        phone: ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSaveDoctor(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            if (editingDoctorId) {
                await axios.put(
                    `${API_URL}/api/doctors/${editingDoctorId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Doctor updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/api/doctors`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Doctor added successfully");
            }

            setShowForm(false);
            setEditingDoctorId(null);
            setFormData({
                name: "",
                specialization: "",
                department: "",
                phone: ""
            });

            fetchDoctors();

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to save doctor");
        }
    }

    async function handleDeleteDoctor(id) {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;

        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(`${API_URL}/api/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Doctor deleted successfully");
            fetchDoctors();

        } catch (error) {
            console.log(error);
            alert("Failed to delete doctor");
        }
    }

    function handleStartEdit(doctor) {
        setEditingDoctorId(doctor.id);
        setFormData({
            name: doctor.name,
            specialization: doctor.specialization,
            department: doctor.department,
            phone: doctor.phone
        });
        setShowForm(true);
    }

    function handleCancel() {
        setShowForm(false);
        setEditingDoctorId(null);
        setFormData({
            name: "",
            specialization: "",
            department: "",
            phone: ""
        });
    }

    async function fetchDoctors() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/doctors`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDoctors(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="doctors">
            <div className="page-header">
                <div>
                    <h1>Doctors</h1>
                    <p>Manage hospital medical specialists and doctors</p>
                </div>

                <button className="add-doctor-btn" onClick={() => {
                    setEditingDoctorId(null);
                    setFormData({ name: "", specialization: "", department: "", phone: "" });
                    setShowForm(true);
                }}>
                    + Add Doctor
                </button>
            </div>

            {showForm && (
                <div className="doctor-form">
                    <h2>{editingDoctorId ? "Edit Doctor" : "Add New Doctor"}</h2>

                    <div className="form-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Doctor Name (e.g. Dr. Rajesh Sharma)"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="specialization"
                            placeholder="Specialization (e.g. Cardiologist)"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="department"
                            placeholder="Department (e.g. Cardiology)"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="btn-primary" onClick={handleSaveDoctor}>
                            {editingDoctorId ? "Update Doctor" : "Save Doctor"}
                        </button>

                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="doctor-search">
                <input
                    type="text"
                    placeholder="Search doctor by name, specialization, or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="doctor-table">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor Name</th>
                            <th>Specialization</th>
                            <th>Department</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors
                            .filter((doctor) =>
                                doctor.name.toLowerCase().includes(search.toLowerCase()) ||
                                doctor.specialization.toLowerCase().includes(search.toLowerCase()) ||
                                doctor.department.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>
                                        <div className="table-avatar-cell">
                                            <span className="doc-avatar">👨‍⚕️</span>
                                            <strong>{doctor.name}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge-specialty">{doctor.specialization}</span>
                                    </td>
                                    <td>{doctor.department}</td>
                                    <td>{doctor.phone}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleStartEdit(doctor)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteDoctor(doctor.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {doctors.length === 0 && (
                            <tr>
                                <td colSpan="5" className="empty-state">No doctors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Doctors;
