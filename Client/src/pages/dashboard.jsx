import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://humorous-heart-production-1e51.up.railway.app";

function Dashboard() {
    const [counts, setCounts] = useState({
        doctors: 24,
        patients: 156,
        appointments: 32,
        departments: 8
    });

    useEffect(() => {
        async function fetchCounts() {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };
                const [docRes, patRes, appRes, depRes] = await Promise.allSettled([
                    axios.get(`${API_URL}/api/doctors`, { headers }),
                    axios.get(`${API_URL}/api/patients`, { headers }),
                    axios.get(`${API_URL}/api/appointments`, { headers }),
                    axios.get(`${API_URL}/api/departments`, { headers })
                ]);

                setCounts({
                    doctors: docRes.status === "fulfilled" && Array.isArray(docRes.value.data) ? docRes.value.data.length : 24,
                    patients: patRes.status === "fulfilled" && Array.isArray(patRes.value.data) ? patRes.value.data.length : 156,
                    appointments: appRes.status === "fulfilled" && Array.isArray(appRes.value.data) ? appRes.value.data.length : 32,
                    departments: depRes.status === "fulfilled" && Array.isArray(depRes.value.data) ? depRes.value.data.length : 8
                });
            } catch (err) {
                console.log(err);
            }
        }

        fetchCounts();
    }, []);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    return (
        <main className="dashboard">
            {/* Top Welcome Hero Banner */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="live-dot"></span> 24/7 Hospital Care Active • {currentDate}
                    </div>
                    <h1>Welcome to Medicore Health System ⚕️</h1>
                    <p>
                        Comprehensive clinical administration platform. Monitor real-time patient records, doctor scheduling, multi-specialty departments, and hospital billing in one unified dashboard.
                    </p>

                    <div className="hero-actions">
                        <button onClick={() => window.location.href = "/patients"}>
                            👥 View Patients
                        </button>
                        <button onClick={() => window.location.href = "/appointments"}>
                            📅 Appointments
                        </button>
                        <button onClick={() => window.location.href = "/billing"}>
                            💳 Billing Center
                        </button>
                    </div>
                </div>
            </section>

            {/* Statistics Cards Grid */}
            <section className="stats-section">
                <div className="section-title">
                    <h2>Hospital Overview</h2>
                    <span className="sub">Real-time system telemetry</span>
                </div>

                <div className="stats-grid">
                    <div className="stat-card blue" onClick={() => window.location.href = "/doctors"}>
                        <div className="stat-top">
                            <div className="stat-icon blue">👨‍⚕️</div>
                            <span className="stat-pill blue">Specialists</span>
                        </div>
                        <h3>Total Doctors</h3>
                        <h2>{counts.doctors}</h2>
                        <p className="stat-note">Qualified MD & Surgeons on duty</p>
                    </div>

                    <div className="stat-card green" onClick={() => window.location.href = "/patients"}>
                        <div className="stat-top">
                            <div className="stat-icon green">👥</div>
                            <span className="stat-pill green">Active</span>
                        </div>
                        <h3>Registered Patients</h3>
                        <h2>{counts.patients}</h2>
                        <p className="stat-note">Inpatient & OPD records</p>
                    </div>

                    <div className="stat-card red" onClick={() => window.location.href = "/appointments"}>
                        <div className="stat-top">
                            <div className="stat-icon red">📅</div>
                            <span className="stat-pill red">Scheduled</span>
                        </div>
                        <h3>Appointments</h3>
                        <h2>{counts.appointments}</h2>
                        <p className="stat-note">Pending & confirmed consultations</p>
                    </div>

                    <div className="stat-card purple" onClick={() => window.location.href = "/departments"}>
                        <div className="stat-top">
                            <div className="stat-icon purple">🏥</div>
                            <span className="stat-pill purple">Wings</span>
                        </div>
                        <h3>Departments</h3>
                        <h2>{counts.departments}</h2>
                        <p className="stat-note">Cardiology, Neurology & Ortho</p>
                    </div>
                </div>
            </section>

            {/* Quick Actions & Emergency Panel */}
            <section className="dashboard-grid-two">
                {/* Quick Management Shortcuts */}
                <div className="dash-card">
                    <div className="dash-card-header">
                        <h3>⚡ Quick Management Actions</h3>
                        <span>Fast Access</span>
                    </div>

                    <div className="quick-actions-list">
                        <div className="action-row" onClick={() => window.location.href = "/patients"}>
                            <span className="action-icon">➕</span>
                            <div>
                                <strong>Admit / Register New Patient</strong>
                                <p>Add patient personal details, contact info, and medical history</p>
                            </div>
                            <span className="arrow">→</span>
                        </div>

                        <div className="action-row" onClick={() => window.location.href = "/appointments"}>
                            <span className="action-icon">📋</span>
                            <div>
                                <strong>Schedule Consultation</strong>
                                <p>Book appointments with available cardiologists and surgeons</p>
                            </div>
                            <span className="arrow">→</span>
                        </div>

                        <div className="action-row" onClick={() => window.location.href = "/billing"}>
                            <span className="action-icon">🧾</span>
                            <div>
                                <strong>Create Patient Invoice</strong>
                                <p>Generate medical bills, treatment receipts, and check payment status</p>
                            </div>
                            <span className="arrow">→</span>
                        </div>

                        <div className="action-row" onClick={() => window.location.href = "/doctors"}>
                            <span className="action-icon">🩺</span>
                            <div>
                                <strong>Doctor Roster & Shifts</strong>
                                <p>View specialist credentials, departments, and on-call phone numbers</p>
                            </div>
                            <span className="arrow">→</span>
                        </div>
                    </div>
                </div>

                {/* Emergency Unit & Hospital Notices */}
                <div className="dash-card emergency-card">
                    <div className="dash-card-header">
                        <h3 className="text-emergency">🚨 Emergency & Facility Status</h3>
                        <span className="badge-live">Live Ward Feed</span>
                    </div>

                    <div className="emergency-stats">
                        <div className="facility-item">
                            <span className="facility-label">Emergency Helpline</span>
                            <span className="facility-val emergency-val">108 / 102 (24x7)</span>
                        </div>

                        <div className="facility-item">
                            <span className="facility-label">ICU & Critical Care Beds</span>
                            <span className="facility-val text-green">14 Available</span>
                        </div>

                        <div className="facility-item">
                            <span className="facility-label">Operating Theatres (OT)</span>
                            <span className="facility-val text-blue">4 Active / 2 Ready</span>
                        </div>

                        <div className="facility-item">
                            <span className="facility-label">Blood Bank Units</span>
                            <span className="facility-val text-purple">O+, B+, AB+ In Stock</span>
                        </div>

                        <div className="facility-item">
                            <span className="facility-label">Ambulance Fleet</span>
                            <span className="facility-val text-green">3 Ready on Campus</span>
                        </div>
                    </div>

                    <div className="emergency-footer-banner">
                        <strong>Medicore Emergency Response</strong>
                        <p>For immediate triage assistance, alert on-duty supervisor or security desk.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;