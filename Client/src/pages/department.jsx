import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Department() {
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [editingDeptId, setEditingDeptId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        doctor_count: ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSaveDepartment(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            if (editingDeptId) {
                await axios.put(
                    `${API_URL}/api/departments/${editingDeptId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Department updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/api/departments`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Department added successfully");
            }

            setShowForm(false);
            setEditingDeptId(null);
            setFormData({
                name: "",
                description: "",
                doctor_count: ""
            });

            fetchDepartments();

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to save department");
        }
    }

    async function handleDeleteDepartment(id) {
        if (!window.confirm("Are you sure you want to delete this department?")) return;

        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(`${API_URL}/api/departments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Department deleted successfully");
            fetchDepartments();

        } catch (error) {
            console.log(error);
            alert("Failed to delete department");
        }
    }

    function handleStartEdit(dept) {
        setEditingDeptId(dept.id);
        setFormData({
            name: dept.name,
            description: dept.description,
            doctor_count: dept.doctor_count
        });
        setShowForm(true);
    }

    function handleCancel() {
        setShowForm(false);
        setEditingDeptId(null);
        setFormData({
            name: "",
            description: "",
            doctor_count: ""
        });
    }

    async function fetchDepartments() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/departments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDepartments(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDepartments();
    }, []);

    function getDeptIcon(name) {
        const lower = (name || "").toLowerCase();
        if (lower.includes("cardio") || lower.includes("heart")) return "❤️";
        if (lower.includes("neuro") || lower.includes("brain")) return "🧠";
        if (lower.includes("ortho") || lower.includes("bone")) return "🦴";
        if (lower.includes("pediatric") || lower.includes("child")) return "👶";
        if (lower.includes("dental") || lower.includes("teeth")) return "🦷";
        if (lower.includes("eye") || lower.includes("ophthal")) return "👁️";
        if (lower.includes("derm") || lower.includes("skin")) return "🔬";
        if (lower.includes("emergency") || lower.includes("icu")) return "🚨";
        return "🏥";
    }

    return (
        <main className="department">
            <div className="page-header">
                <div>
                    <h1>Departments</h1>
                    <p>Manage hospital medical departments and specialized wings</p>
                </div>

                <button className="add-department-btn" onClick={() => {
                    setEditingDeptId(null);
                    setFormData({ name: "", description: "", doctor_count: "" });
                    setShowForm(true);
                }}>
                    + Add Department
                </button>
            </div>

            {showForm && (
                <div className="department-form">
                    <h2>{editingDeptId ? "Edit Department" : "Add New Department"}</h2>

                    <div className="form-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Department Name (e.g. Cardiology)"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="description"
                            placeholder="Description (e.g. Heart and cardiovascular care)"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="doctor_count"
                            placeholder="Number of Doctors (e.g. 5)"
                            value={formData.doctor_count}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="btn-primary" onClick={handleSaveDepartment}>
                            {editingDeptId ? "Update Department" : "Save Department"}
                        </button>

                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="department-search">
                <input
                    type="text"
                    placeholder="Search departments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="department-cards">
                {departments
                    .filter((dept) =>
                        dept.name.toLowerCase().includes(search.toLowerCase()) ||
                        dept.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((dept) => (
                        <div className="department-card" key={dept.id}>
                            <div className="card-top">
                                <div className="card-icon">{getDeptIcon(dept.name)}</div>
                                <span className="doctor-badge">{dept.doctor_count || 0} Doctors</span>
                            </div>

                            <h3>{dept.name}</h3>
                            <p>{dept.description}</p>

                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => handleStartEdit(dept)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteDepartment(dept.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                {departments.length === 0 && (
                    <div className="empty-state">No departments registered yet.</div>
                )}
            </div>
        </main>
    );
}

export default Department;