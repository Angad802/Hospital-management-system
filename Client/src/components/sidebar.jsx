import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: "/", label: "Dashboard", icon: "📊", section: "Main" },
        { path: "/patients", label: "Patients", icon: "👥", section: "Clinical" },
        { path: "/doctors", label: "Doctors", icon: "👨‍⚕️", section: "Clinical" },
        { path: "/appointments", label: "Appointments", icon: "📅", section: "Clinical" },
        { path: "/departments", label: "Departments", icon: "🏥", section: "Clinical" },
        { path: "/billing", label: "Billing & Invoices", icon: "💳", section: "Admin" },
        { path: "/profile", label: "My Profile", icon: "👤", section: "Admin" }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Clinical Portal</h2>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group-label">OVERVIEW</div>
                <Link
                    to="/"
                    className={`sidebar-link ${currentPath === "/" ? "active" : ""}`}
                >
                    <span className="link-icon">📊</span>
                    <span className="link-label">Dashboard</span>
                </Link>

                <div className="nav-group-label">CLINICAL CARE</div>
                <Link
                    to="/patients"
                    className={`sidebar-link ${currentPath.startsWith("/patients") ? "active" : ""}`}
                >
                    <span className="link-icon">👥</span>
                    <span className="link-label">Patients</span>
                </Link>

                <Link
                    to="/doctors"
                    className={`sidebar-link ${currentPath.startsWith("/doctors") ? "active" : ""}`}
                >
                    <span className="link-icon">👨‍⚕️</span>
                    <span className="link-label">Doctors</span>
                </Link>

                <Link
                    to="/appointments"
                    className={`sidebar-link ${currentPath.startsWith("/appointment") ? "active" : ""}`}
                >
                    <span className="link-icon">📅</span>
                    <span className="link-label">Appointments</span>
                </Link>

                <Link
                    to="/departments"
                    className={`sidebar-link ${currentPath.startsWith("/department") ? "active" : ""}`}
                >
                    <span className="link-icon">🏥</span>
                    <span className="link-label">Departments</span>
                </Link>

                <div className="nav-group-label">ADMINISTRATION</div>
                <Link
                    to="/billing"
                    className={`sidebar-link ${currentPath.startsWith("/billing") ? "active" : ""}`}
                >
                    <span className="link-icon">💳</span>
                    <span className="link-label">Billing & Invoices</span>
                </Link>

                <Link
                    to="/profile"
                    className={`sidebar-link ${currentPath.startsWith("/profile") ? "active" : ""}`}
                >
                    <span className="link-icon">👤</span>
                    <span className="link-label">My Profile</span>
                </Link>
            </nav>

            <div className="sidebar-emergency-box">
                <div className="em-title">
                    <span className="em-dot"></span> Emergency 24/7
                </div>
                <p className="em-number">🚨 Dial 108 / 102</p>
                <span className="em-sub">Ambulance & Trauma Care</span>
            </div>
        </aside>
    );
}

export default Sidebar;