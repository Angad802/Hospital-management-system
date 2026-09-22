import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://humorous-heart-production-1e51.up.railway.app";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [editingAppointmentId, setEditingAppointmentId] = useState(null);

    const [formData, setFormData] = useState({
        patient_name: "",
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
        status: "Pending"
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSaveAppointment(e) {
        e.preventDefault();

        try {
            const token = sessionStorage.getItem("token");

            if (editingAppointmentId) {
                await axios.put(
                    `${API_URL}/api/appointments/${editingAppointmentId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Appointment updated successfully");
            } else {
                await axios.post(
                    `${API_URL}/api/appointments`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Appointment added successfully");
            }

            setShowForm(false);
            setEditingAppointmentId(null);
            setFormData({
                patient_name: "",
                doctor_name: "",
                appointment_date: "",
                appointment_time: "",
                status: "Pending"
            });

            fetchAppointments();

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to save appointment");
        }
    }

    async function handleDeleteAppointment(id) {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;

        try {
            const token = sessionStorage.getItem("token");

            await axios.delete(`${API_URL}/api/appointments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Appointment deleted successfully");
            fetchAppointments();

        } catch (error) {
            console.log(error);
            alert("Failed to delete appointment");
        }
    }

    function handleStartEdit(appointment) {
        setEditingAppointmentId(appointment.id);
        setFormData({
            patient_name: appointment.patient_name,
            doctor_name: appointment.doctor_name,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            status: appointment.status
        });
        setShowForm(true);
    }

    function handleCancel() {
        setShowForm(false);
        setEditingAppointmentId(null);
        setFormData({
            patient_name: "",
            doctor_name: "",
            appointment_date: "",
            appointment_time: "",
            status: "Pending"
        });
    }

    async function fetchAppointments() {
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/appointments`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAppointments(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, []);

    function getStatusClass(status) {
        const lower = (status || "").toLowerCase();
        if (lower === "confirmed") return "status confirmed";
        if (lower === "cancelled") return "status cancelled";
        return "status pending";
    }

    return (
        <main className="appointments">
            <div className="page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>Manage patient appointments and doctor scheduling</p>
                </div>

                <button className="add-appointment-btn" onClick={() => {
                    setEditingAppointmentId(null);
                    setFormData({ patient_name: "", doctor_name: "", appointment_date: "", appointment_time: "", status: "Pending" });
                    setShowForm(true);
                }}>
                    + Add Appointment
                </button>
            </div>

            {showForm && (
                <div className="appointment-form">
                    <h2>{editingAppointmentId ? "Edit Appointment" : "Schedule New Appointment"}</h2>

                    <div className="form-grid">
                        <input
                            type="text"
                            name="patient_name"
                            placeholder="Patient Full Name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="doctor_name"
                            placeholder="Doctor Name (e.g. Dr. Rajesh Sharma)"
                            value={formData.doctor_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="appointment_time"
                            placeholder="Time (e.g. 10:00 AM)"
                            value={formData.appointment_time}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="btn-primary" onClick={handleSaveAppointment}>
                            {editingAppointmentId ? "Update Appointment" : "Save Appointment"}
                        </button>

                        <button type="button" className="btn-secondary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="appointment-search">
                <input
                    type="text"
                    placeholder="Search appointments by patient or doctor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="appointment-table">
                <table>
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments
                            .filter((item) =>
                                (item.patient_name || "").toLowerCase().includes(search.toLowerCase()) ||
                                (item.doctor_name || "").toLowerCase().includes(search.toLowerCase())
                            )
                            .map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <strong>{item.patient_name}</strong>
                                    </td>
                                    <td>{item.doctor_name}</td>
                                    <td>{item.appointment_date}</td>
                                    <td>{item.appointment_time}</td>
                                    <td>
                                        <span className={getStatusClass(item.status)}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleStartEdit(item)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteAppointment(item.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        {appointments.length === 0 && (
                            <tr>
                                <td colSpan="6" className="empty-state">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Appointments;